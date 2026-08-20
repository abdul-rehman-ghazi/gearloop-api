# Actually charge the card — design

Part of [gearloop-feature-ideas.md](../../gearloop-feature-ideas.md) Tier 1, item 3: "`PaymentMethod.processorPaymentMethodId` is stored and never used. Auth-hold on request → capture on confirm → release on decline. That, plus a payout job, is what makes `payoutStatus` mean something."

Design decisions below were made autonomously (user instruction: proceed without pausing for approval, pick the recommended option). Each is logged as a ruling.

## Problem

Booking creation and status transitions today are pure database writes — no money ever moves. `PaymentMethod.processorPaymentMethodId` is stored at payment-method creation and never read again.

## Rulings

**Ruling 1 — Stripe, real API calls in test mode, chosen by the user directly** (not an autonomous ruling — this was asked and answered earlier in this session). `processorPaymentMethodId` is already Stripe-shaped per its own doc comment ("Stripe (or whichever processor) token"). Test-mode secret key, test-mode cards, real HTTPS calls to Stripe — no real money moves, but the integration is genuine, not mocked at the application layer (only mocked in unit tests, via `jest.mock('stripe')`, the same pattern already established for `nodemailer`).

**Ruling 2 — payouts to owners are out of scope for this task.** The doc bundles "auth-hold → capture → release" with "a payout job" under one item, but paying an owner requires knowing where their money goes — a Stripe Connect account, a bank account, an identity-verified payee. None of that exists anywhere in the schema (no `OwnerPayoutAccount`, no Connect onbooring flow, no `User` fields for it). Building it now would mean designing Stripe Connect onboarding, webhook handling for account verification, and a new data model, none of which the doc's own wording implies is ready to build — it's future work with its own spec. This task makes `Booking.payoutStatus` mean something truthful (captured funds sit in the platform's Stripe balance, `pending` = captured and awaiting a payout job that doesn't exist yet), which is what the doc's sentence actually asks for; it does not build the payout job itself.

**Ruling 3 — no swallow-and-log fallback for a missing Stripe key, unlike `EmailService`.** `EmailService` logs instead of sending when unconfigured, because a missing email is invisible and low-stakes. A missing or invalid Stripe key must fail loudly — silently skipping a card charge (or silently pretending one succeeded) is a correctness and trust bug in a marketplace, exactly the kind of thing ponytail's "never simplify away... security measures" carves out. If `STRIPE_SECRET_KEY` is unset, the first real charge attempt throws (Stripe's own SDK errors when constructed with an empty key and called), which surfaces as a 500 — visible in logs and to the caller, not swallowed.

**Ruling 4 — no idempotency keys on Stripe calls.** Stripe's own dashboard/API deduplicates aggressively per test-mode use at this scale, and a real idempotency-key scheme needs a stable key derivable before the `Booking` row exists (chicken-and-egg: the intent is created *before* the booking that would normally supply that key). Marked as a `ponytail:` deferred item with its upgrade path (derive a key from `${renterId}:${listingId}:${startDate}:${endDate}` once retry-safety is needed) rather than solved now.

**Ruling 5 — a card decline blocks booking creation entirely; a capture/cancel failure blocks the status transition entirely.** No booking is created without a successful auth-hold. No booking moves to `confirmed` without a successful capture, and none moves to `cancelled` without the hold being released (cancelled if never captured, refunded if it was). This matches how `create()` already refuses to write a booking on a date-overlap conflict — a failed payment step is exactly as blocking as a failed availability check.

## Data model

`Booking` gains one field to track the Stripe object it owns:

```prisma
model Booking {
  // ...existing fields...
  paymentIntentId String? // Stripe PaymentIntent id; set once the auth-hold succeeds
}
```

No new enum. `BookingStatus` and `PayoutStatus` are unchanged — this task makes their existing transitions trustworthy, it doesn't add new states. `payoutStatus: 'pending'` (already set on confirm today) now truthfully means "captured, sitting in the platform Stripe balance, awaiting a payout job."

## Service

New `PaymentsService` (`src/payments/payments.service.ts`) — the only file that imports the `stripe` package, mirroring how `EmailService` is the only file that imports `nodemailer`:

- `authorize(processorPaymentMethodId: string, amount: Decimal, currency = 'usd'): Promise<string>` — creates a Stripe `PaymentIntent` with `capture_method: 'manual'`, `confirm: true`, `payment_method: processorPaymentMethodId`, `off_session: true` (the renter isn't present at booking-request time to complete a 3-D Secure challenge — off-session tells Stripe to use whatever authentication the payment method already has). Returns the PaymentIntent id. Throws (does not catch) on a card decline — Stripe's SDK raises `StripeCardError`, which propagates to the caller as-is; `BookingsService` translates it to a `BadRequestException`.
- `capture(paymentIntentId: string): Promise<void>` — `stripe.paymentIntents.capture(id)`.
- `release(paymentIntentId: string): Promise<void>` — fetches the PaymentIntent's current status; if it's still `requires_capture` (never captured), calls `stripe.paymentIntents.cancel(id)`; if it's `succeeded` (already captured — e.g. cancelling a `confirmed` booking), calls `stripe.refunds.create({ payment_intent: id })` instead. One method, two Stripe calls depending on state, so callers (`BookingsService`) don't need to know which branch applies.

Amount conversion (`Decimal` dollars → integer cents) happens once, inside `authorize`, via `Math.round(amount.toNumber() * 100)` — the only place in the codebase that needs to know Stripe's minor-unit convention.

`PaymentsService` constructs its Stripe client once in the constructor from `ConfigService.get('STRIPE_SECRET_KEY')`. No fallback branch, no `if (!key)` guard (Ruling 3) — an empty key is a valid string that Stripe's SDK accepts at construction and rejects at call time, which is the desired "fail at the point of an actual charge, not at boot" behavior without any code needed to produce it.

## Call sites (append-only edits to `BookingsService`)

- **`create()`** — after the existing overlap check and pricing calculation, before `prisma.booking.create`: call `paymentsService.authorize(paymentMethod.processorPaymentMethodId, total)`. Wrap the Stripe call so a `StripeCardError` becomes `BadRequestException('Card was declined')` (Stripe's own message is available on the error but not surfaced verbatim, to avoid leaking processor-specific detail to the client). On success, include the returned `paymentIntentId` in the `booking.create` data.
- **`updateStatus()`**, `confirmed` branch — after the existing overlap re-check, before `prisma.booking.update`: call `paymentsService.capture(existing.paymentIntentId)`. On failure, throw `ConflictException('Payment could not be captured')` and do not update the booking's status.
- **`updateStatus()`**, `cancelled` branch — before `prisma.booking.update`: call `paymentsService.release(existing.paymentIntentId)`. On failure, throw `ConflictException('Payment could not be released')` and do not update the booking's status.
- No action needed for `completed` — the capture already happened at `confirmed`.

`BookingsModule` imports `PaymentsModule`; `PaymentsModule` exports `PaymentsService`. `PaymentsModule` has no `imports` array entries of its own — `ConfigModule` is already global (`isGlobal: true`, established in the notifications feature), so `PaymentsService`'s `ConfigService` injection resolves without `PaymentsModule` importing anything.

## Files

- `prisma/schema.prisma` — `Booking.paymentIntentId String?`. One migration.
- `src/payments/payments.service.ts`
- `src/payments/payments.service.spec.ts` — unit tests, `jest.mock('stripe')`, no real network.
- `src/payments/payments.module.ts`
- Modify: `src/bookings/bookings.service.ts` (inject `PaymentsService`; three call sites above), `src/bookings/bookings.module.ts` (import `PaymentsModule`), `src/bookings/bookings.service.spec.ts` (extend with payment-trigger tests, same file the notifications feature just created)
- Modify: `package.json` — add `stripe`
- Modify: `.env.example` — add `STRIPE_SECRET_KEY` (no default value — this one has no unconfigured-fallback path, unlike the `EMAIL_*` vars)
- `src/app.module.ts` is **not** modified. `PaymentsModule` has no controller and is consumed only via `BookingsModule`'s import; NestJS resolves it through that import since `BookingsModule` is already registered in `AppModule`. No top-level registration needed.

## Out of scope

- The payout job itself (Ruling 2) — moving captured funds from the platform's Stripe balance to an owner. Needs its own spec: Stripe Connect account model, onboarding flow, a scheduled job.
- Idempotency keys on Stripe calls (Ruling 4).
- 3-D Secure / SCA challenge handling for a renter who isn't present (`off_session: true` accepts whatever Stripe decides is sufficient; a hold that Stripe refuses to auto-authenticate surfaces as the same `StripeCardError` path as a decline).
- Partial captures or partial refunds — `capture`/`release` always act on the full authorized amount.
- Webhooks (Stripe's async payment-intent status updates via webhook are not consumed; this integration is synchronous request/response only, matching the dev-scale scope of the rest of the codebase).
