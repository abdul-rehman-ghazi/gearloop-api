# Security deposit + damage claims — design

Part of [gearloop-feature-ideas.md](../../gearloop-feature-ideas.md) Tier 1, item 4: "`Dispute` is status + free text with no money attached. Hold a deposit, release on clean return, claim against it with a resolution amount."

Design decisions below were made autonomously (user instruction: proceed without pausing for approval, pick the recommended option). Each is logged as a ruling.

## Problem

`Dispute` today is `status` + `detail` + a `bookingId`. Filing one sets `booking.payoutStatus = 'on_hold'`, and resolving it sets it back to `pending`. That is the entire financial consequence of a damage report — the owner is out a scratched lens and the platform's only lever is delaying a payout that goes to the owner anyway. There is no deposit anywhere in the schema: no field on `Listing`, none on `Booking`, no second Stripe intent. A renter's card is authorised for the rental total and nothing else.

## Depends on

**Item 3 (Actually charge the card) — merged and in the codebase.** Verified, not assumed: `src/payments/payments.service.ts` exists with `authorize`/`capture`/`release`, `Booking.paymentIntentId` is in `prisma/schema.prisma`, `BookingsService` injects `PaymentsService` and calls all three verbs (`src/bookings/bookings.service.ts:62`, `:182`, `:196`), and `stripe` is a real dependency. This feature extends that abstraction rather than introducing a second one: the deposit is a second Stripe PaymentIntent, created through the same `PaymentsService.authorize`, released through the same `PaymentsService.release`, and captured through the same `PaymentsService.capture` — which gains one optional `amount` argument so a partial claim can be captured (Ruling 4). No new processor client, no parallel payment path.

## Rulings

**Ruling 1 — the deposit is a second PaymentIntent, not part of the rental total.** The rental hold is *captured* at `confirmed`; the deposit must stay *uncaptured* through the whole rental and past the return. One intent cannot be both. Stripe's partial capture releases the uncaptured remainder rather than holding it, so folding the deposit into `Booking.total` and capturing only the rental portion at confirm would silently release the deposit at exactly the moment it needs to start mattering. Two intents, two lifecycles, both on the same card and the same `PaymentMethod`.

**Ruling 2 — the amount comes from the listing and is snapshotted onto the booking.** `Listing.depositAmount` is what the owner asks for; `Booking.depositAmount` is what this particular renter was actually held for. Exactly the precedent `pricePerDayAtBooking`/`subtotal`/`total` already set in the `Booking` model, and for exactly the same reason: an owner raising their deposit next month must not retroactively change what a past booking held. Default `0` — most listings won't set one, and a `0` deposit means no Stripe call at all and `depositStatus` stays `null`.

**Ruling 3 — the deposit hold is placed at booking *create*, alongside the rental auth-hold, not at confirm.** One card interaction, one failure path, one place in `create()` where a declined card blocks the booking. Splitting them (rental hold at create, deposit hold at confirm) would mean a booking that passed the card check at request time can still fail at confirm because the deposit portion declined — a worse failure mode, at a worse moment, for more code. The known ceiling: a Stripe auth-hold expires in roughly 7 days, so a deposit held for a booking that starts three weeks out will have lapsed before the gear is handed over. This is a genuine limitation, not a shrug — it gets a `ponytail:` comment naming the upgrade path (a scheduled re-authorize job, or Stripe's `extended_authorization` capability on the card networks that support it). It is deliberately not solved here: solving it means introducing a scheduler, which nothing in this codebase has yet and which item 4 does not require.

**Ruling 4 — `PaymentsService.capture` gains an optional `amount`, rather than a new `captureAmount` method.** A partial claim ("$40 of the $200 deposit") is `stripe.paymentIntents.capture(id, { amount_to_capture })`, and Stripe automatically releases the uncaptured remainder back to the renter — which is exactly the "partially claimed" semantic we want, for free, with no second call. One optional parameter on an existing verb beats a fourth verb that does 95% of the same thing.

**Ruling 5 — the damage claim *is* a `Dispute`, extended with money. No `DamageClaim` model.** The feature doc's own wording ("`Dispute` is status + free text with **no money attached**") asks for money attached to the existing thing, not a new thing beside it. `Dispute` gains `claimAmount` (what the owner asks for) and `resolvedAmount` (what an admin awards). Both nullable: a `Dispute` with `claimAmount = null` is today's free-text dispute, unchanged, and the existing `DisputesService.create` / `updateStatus` / admin controller keep working for it. The one-dispute-per-booking `@@unique` already on `bookingId` is what makes "one claim per booking" a database constraint rather than an app check.

**Ruling 6 — only the owner can file a money claim, and only the owner can mark a booking `completed`.** The claim restriction is obvious (the renter has no damage to claim against themselves). The `completed` restriction is the non-obvious half and it is load-bearing: `completed` is what releases the deposit (Ruling 7), so leaving that transition open to the renter — as it is today — would let a renter release their own deposit before the owner has inspected the gear. That is a money-security boundary, so it does not get simplified away. Two lines in `updateStatus`.

**Ruling 7 — "clean return" is the `completed` transition with no dispute on the booking.** The owner takes the gear back, looks at it, and either files a claim or marks the booking completed. Completing with no dispute present releases the deposit (`depositStatus: 'released'`, Stripe cancels the uncaptured hold). Completing with a dispute present leaves the deposit `held` until an admin resolves the dispute. No timer, no scheduled auto-release, no new claim-window state — the owner's own two available actions cover both outcomes, and the ordering ("inspect, then complete") is the real-world workflow anyway. The auto-release-after-N-days job is listed under Out of scope with its trigger condition.

**Ruling 8 — the renter does not get a structured counter-claim; an admin resolves.** The renter is already notified when a dispute is filed (the existing `dispute_filed` notification, which now carries the claim amount in its body) and can already argue via the existing per-listing message thread. Building a formal rebuttal record, an evidence-upload flow, or a renter-accepts/renter-contests state machine is a second feature. `resolvedAmount` is set by an admin through the existing `PATCH /admin/disputes/:id/status`, which is already admin-guarded and already the resolution point.

## Data model

```prisma
enum DepositStatus {
  held
  released
  claimed
  partially_claimed
}

model Listing {
  // ...existing fields...
  // What the owner asks renters to put up. 0 (the default) means this
  // listing takes no deposit and no second hold is placed.
  depositAmount Decimal @default(0) @db.Decimal(10, 2)
}

model Booking {
  // ...existing fields...
  // Snapshot, same reasoning as pricePerDayAtBooking: raising a listing's
  // deposit must not retroactively change what a past booking held.
  depositAmount   Decimal        @default(0) @db.Decimal(10, 2)
  // Second Stripe PaymentIntent, held (never captured) for the rental's
  // duration. Null when depositAmount is 0.
  depositIntentId String?
  depositStatus   DepositStatus?
}

model Dispute {
  // ...existing fields...
  // Null = a plain free-text dispute, exactly as today. Non-null = a damage
  // claim against the booking's deposit; <= booking.depositAmount, enforced
  // at the service layer.
  claimAmount    Decimal? @db.Decimal(10, 2)
  // What an admin actually awarded, 0 <= resolvedAmount <= claimAmount.
  // Set at resolution; drives the partial capture.
  resolvedAmount Decimal? @db.Decimal(10, 2)
}
```

`NotificationType` gains one value, `deposit_released` — real money going back to a renter's card is worth telling them about, and the claim-filed/claim-resolved events already reuse the existing `dispute_filed`/`dispute_resolved` types.

### Lifecycle

| Trigger | `depositStatus` | Stripe |
| --- | --- | --- |
| `POST /bookings`, `depositAmount > 0` | `held` | second `authorize` (uncaptured hold) |
| `POST /bookings`, `depositAmount = 0` | `null` | no call |
| booking → `cancelled` | `released` | `release` (cancels the hold) |
| booking → `completed`, no dispute | `released` | `release` |
| booking → `completed`, dispute exists | `held` (unchanged) | no call |
| dispute resolved, `resolvedAmount = 0`/null | `released` | `release` |
| dispute resolved, `0 < resolvedAmount < depositAmount` | `partially_claimed` | `capture(id, resolvedAmount)` — Stripe releases the remainder |
| dispute resolved, `resolvedAmount = depositAmount` | `claimed` | `capture(id, resolvedAmount)` |

The rental hold's own lifecycle (`paymentIntentId`, captured at confirm) is untouched.

## API

No new controllers and no new modules. Three existing surfaces gain a field:

- `POST /listings`, `PATCH /listings/:id` — `depositAmount?: number`, optional, defaults to `0`.
- `POST /disputes` — `claimAmount?: number`, optional. Owner-only when present.
- `PATCH /admin/disputes/:id/status` — `resolvedAmount?: number`, optional, meaningful only alongside `status: 'resolved'`.

`GET /bookings/:id` and the booking list endpoints return `depositAmount` / `depositStatus` automatically — they select the whole row.

## Validation rules (service layer)

**`CreateListingDto` / `UpdateListingDto`** — `@IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(10000)`. The cap is a fat-finger guard, not a business rule: a mistyped `100000` would place a five-figure hold on a real renter's card.

**`DisputesService.create`, when `claimAmount` is present:**

1. Caller must be `booking.listing.ownerId` → else `ForbiddenException('Only the owner can claim against the deposit')`. (Renters filing a claimless dispute keep the existing either-party rule.)
2. `booking.depositStatus` must be `'held'` → else `ConflictException('No deposit is held for this booking')`. This single check subsumes "the listing had no deposit", "the deposit was already released", and "it was already claimed".
3. `claimAmount` must be `> 0` and `<= booking.depositAmount` → else `BadRequestException('Claim exceeds the deposit held')`.
4. DTO: `@IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive()`.

**`DisputesService.updateStatus`, when `status === 'resolved'`:**

1. `resolvedAmount` is only honoured when `dispute.claimAmount` is non-null; supplying it on a claimless dispute → `BadRequestException('This dispute has no claim to resolve')`.
2. `0 <= resolvedAmount <= dispute.claimAmount` → else `BadRequestException('Resolution exceeds the amount claimed')`.
3. Omitting `resolvedAmount` on a claim dispute resolves it in the renter's favour: full release. Silence means "no damage awarded", which is the safe default for the party who isn't in the room.
4. The Stripe call happens **before** the database write, so a capture/release failure leaves the dispute unresolved rather than marking it resolved with the money still held — the same ordering rule item 3 established (Ruling 5 of that spec).

**`BookingsService.updateStatus`:**

- `completed` is owner-only (Ruling 6) → else `ForbiddenException('Only the owner can complete a booking')`.
- `completed` releases the deposit only when `depositStatus === 'held'` and the booking has no `dispute`.
- `cancelled` releases the deposit whenever `depositStatus === 'held'`, next to the existing rental-hold release.
- A deposit release failure is a `ConflictException('Deposit could not be released')` and blocks the transition, matching the existing `'Payment could not be released'` behaviour.

## Files

- `prisma/schema.prisma` — `DepositStatus` enum, `Listing.depositAmount`, `Booking.depositAmount`/`depositIntentId`/`depositStatus`, `Dispute.claimAmount`/`resolvedAmount`, `NotificationType.deposit_released`. One migration.
- Modify: `src/payments/payments.service.ts` — optional `amount` on `capture` (Ruling 4)
- Modify: `src/payments/payments.service.spec.ts` — partial-capture tests
- Modify: `src/listings/dto/create-listing.dto.ts` — `depositAmount`
- Modify: `src/bookings/bookings.service.ts` — deposit hold in `create()`; owner-only `completed`; deposit release in the `completed`/`cancelled` branches of `updateStatus()`
- Modify: `src/bookings/bookings.service.spec.ts` — deposit tests appended
- Modify: `src/disputes/dto/create-dispute.dto.ts` — `claimAmount`
- Modify: `src/disputes/dto/update-dispute-status.dto.ts` — `resolvedAmount`
- Modify: `src/disputes/disputes.service.ts` — claim validation on `create`, capture/release on `updateStatus`
- Modify: `src/disputes/disputes.service.spec.ts` — claim tests appended
- Modify: `src/disputes/disputes.module.ts` — import `PaymentsModule`
- `src/app.module.ts` is **not** modified — `PaymentsModule` is reached through `DisputesModule`'s import, the same way `BookingsModule` already reaches it.
- `package.json` and `.env.example` are **not** modified — `stripe` and `STRIPE_SECRET_KEY` are already there from item 3.

## Out of scope

- **Handoff condition photos (item 5).** This is the future improvement that makes the release decision evidence-based instead of the owner's word: timestamped pickup/return photos from both parties would let `completed` be safely renter-initiated too, and would give an admin something concrete to weigh when setting `resolvedAmount`. Separate task, separate spec. Nothing here blocks it — it slots in as evidence attached to the `Dispute` and as a precondition on the `completed` transition.
- **Auto-release after an N-day claim window.** Would let either party complete a booking and release the deposit on a timer if the owner never files. Needs a scheduler (`@nestjs/schedule` or an external cron), which nothing in this codebase has yet. Add it when the "owner never marks the booking completed" case shows up in practice; Ruling 7 covers the common path without it.
- **Re-authorizing an expiring deposit hold.** The Stripe ~7-day auth window (Ruling 3) is a real ceiling for bookings placed far in advance. Marked with a `ponytail:` comment; the fix is the same scheduler as above, or `extended_authorization`.
- **A renter counter-claim / rebuttal record** (Ruling 8) — the renter argues in the existing message thread and an admin decides.
- **Cancellation and refund policy (item 7, Tier 2).** Cancelling releases the deposit in full, with no tiering, no penalty, and no partial forfeit — exactly the "no rules" state item 7 exists to fix. This feature does not change rental refund behaviour at all.
- **Payouts.** Still out of scope, inherited from item 3's Ruling 2. A captured claim lands in the platform's Stripe balance alongside captured rental funds; getting it to the owner is the payout job that does not exist yet.
- **Deposit-free trusted renters (item 13).** No `User` tier reduces or waives the deposit.
- **Disputing a resolution / appeals.** An admin's `resolvedAmount` is final; the capture is immediate and irreversible from the API's side.
