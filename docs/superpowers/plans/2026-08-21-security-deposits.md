# Security Deposit + Damage Claims Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put real money behind a damage report. A listing declares a deposit, booking creation places a second uncaptured Stripe hold for it, a clean return releases that hold, and an owner's damage claim — resolved by an admin with an award amount — captures part or all of it.

**Architecture:** The deposit is a **second Stripe PaymentIntent** on the same card, running through the **existing** `PaymentsService` from item 3 (`authorize` / `capture` / `release`) — not a new payment abstraction. `PaymentsService.capture` gains one optional `amount` argument so a partial award can be captured, with Stripe releasing the remainder automatically. The claim itself is the existing `Dispute` row with two money columns bolted on; there is no `DamageClaim` model and no new controller.

**Tech Stack:** NestJS 11, Prisma 7 (`prisma-client` generator, output `generated/prisma`), PostgreSQL, `stripe` (already installed by item 3), Jest 30 + ts-jest with hand-rolled mocks (no `Test.createTestingModule` anywhere in this repo).

**Spec:** `docs/superpowers/specs/2026-08-21-security-deposits-design.md`

**Dependency status (verified, not assumed):** item 3 (Actually charge the card) is **merged**. `src/payments/payments.service.ts`, `src/payments/payments.module.ts`, `Booking.paymentIntentId`, and the three `PaymentsService` call sites in `BookingsService` all exist in the working tree. Nothing in this plan needs to stub or build them.

## Global Constraints

- **Ruling 1 — two intents, never one.** Never fold `depositAmount` into `Booking.total` and never touch `Booking.total`, `subtotal`, `serviceFee`, or `tax`. The deposit lives entirely in `depositAmount` / `depositIntentId` / `depositStatus`.
- **Ruling 3 — the deposit hold is placed in `create()`**, immediately after the rental auth-hold. If the deposit hold fails, the rental hold placed moments earlier must be released before the error propagates, or the renter is left with an orphaned hold on a booking that never existed. The `ponytail:` comment naming the ~7-day Stripe auth-window ceiling goes on that code.
- **`depositAmount === 0` means no Stripe call at all.** `depositStatus` stays `null`, `depositIntentId` stays `null`. Every deposit code path guards on `depositStatus === 'held'` first, so a zero-deposit booking silently skips all of it.
- **Money moves before the row changes.** In both `BookingsService.updateStatus` and `DisputesService.updateStatus`, the Stripe call happens **before** `prisma.*.update`. A Stripe failure means no status change and no notification — the same ordering item 3 established.
- **Ruling 6 — `completed` is owner-only.** This is a money-security boundary (it releases the deposit), not polish. Do not simplify it away.
- Exact user-facing messages, verbatim: `'Deposit could not be released'`, `'Deposit could not be claimed'`, `'Only the owner can complete a booking'`, `'Only the owner can claim against the deposit'`, `'No deposit is held for this booking'`, `'Claim exceeds the deposit held'`, `'This dispute has no claim to resolve'`, `'Resolution exceeds the amount claimed'`.
- **Out of scope, do not build:** handoff photos (item 5), an auto-release scheduler, hold re-authorization, renter counter-claims, cancellation/refund tiers (item 7), payout jobs, trusted-renter deposit waivers.
- Existing tests must keep passing. The only permitted edits to them are mechanical: adding `DisputesService`'s third constructor argument, and adding deposit fields to shared fixtures. No assertion in an existing test changes.
- `src/app.module.ts` is **not** modified. `package.json` and `.env.example` are **not** modified.

## File Structure

| File | Responsibility |
| --- | --- |
| `prisma/schema.prisma` (modify) | `DepositStatus` enum, 1 `Listing` field, 3 `Booking` fields, 2 `Dispute` fields, 1 `NotificationType` value |
| `prisma/migrations/<ts>_add_security_deposits/` (create, generated) | The migration |
| `src/payments/payments.service.ts` (modify) | Optional `amount` on `capture` |
| `src/payments/payments.service.spec.ts` (modify) | Partial-capture tests appended |
| `src/listings/dto/create-listing.dto.ts` (modify) | `depositAmount?: number` |
| `src/bookings/bookings.service.ts` (modify) | Deposit hold in `create()`; owner-only `completed`; deposit release in `updateStatus()` |
| `src/bookings/bookings.service.spec.ts` (modify) | Deposit tests appended + mechanical fixture edits |
| `src/disputes/dto/create-dispute.dto.ts` (modify) | `claimAmount?: number` |
| `src/disputes/dto/update-dispute-status.dto.ts` (modify) | `resolvedAmount?: number` |
| `src/disputes/disputes.service.ts` (modify) | Claim validation on `create`; capture/release on resolve |
| `src/disputes/disputes.service.spec.ts` (modify) | Claim tests appended + mechanical constructor edits |
| `src/disputes/disputes.module.ts` (modify) | Imports `PaymentsModule` |

**Scope check:** single subsystem (deposit money on an existing booking/dispute pair). One plan, no sub-plans.

**Task count and boundaries (5 tasks):** (1) schema — reviewable as pure data-model additive change, no behaviour; (2) `PaymentsService.capture` amount — testable in isolation with zero knowledge of deposits; (3) placing the hold at booking creation — the "renter's card gets held for money it shouldn't" risk profile; (4) releasing the hold — the "renter's money stays trapped" risk profile, plus the owner-only `completed` guard; (5) claiming against it — the "money is captured from a renter" risk profile, the sharpest of the three. 3/4/5 are split because a reviewer could sensibly approve the hold while rejecting the release trigger, and the claim path is the one that irreversibly takes a renter's money.

---

### Task 1: Deposit schema

**Files:**
- Modify: `prisma/schema.prisma` (enums block; `Listing`, `Booking`, `Dispute` models)
- Create (generated): `prisma/migrations/<timestamp>_add_security_deposits/migration.sql`

**Interfaces:**
- Consumes: nothing.
- Produces: `DepositStatus` type; `Listing.depositAmount: Prisma.Decimal`; `Booking.depositAmount: Prisma.Decimal`, `Booking.depositIntentId: string | null`, `Booking.depositStatus: DepositStatus | null`; `Dispute.claimAmount: Prisma.Decimal | null`, `Dispute.resolvedAmount: Prisma.Decimal | null`; `'deposit_released'` accepted by `NotificationsService.notify`.

- [ ] **Step 1: Add the `DepositStatus` enum**

In `prisma/schema.prisma`, in the enums block, immediately after `enum DisputeStatus { ... }`, add:

```prisma
enum DepositStatus {
  held
  released
  claimed
  partially_claimed
}
```

- [ ] **Step 2: Add the `deposit_released` notification type**

In `enum NotificationType`, append after `dispute_resolved`:

```prisma
  deposit_released
```

- [ ] **Step 3: Add `Listing.depositAmount`**

In `model Listing`, immediately after the `pricePerDay Decimal @db.Decimal(10, 2)` line, add:

```prisma
  // What the owner asks renters to put up as a security deposit. 0 (the
  // default) means this listing takes no deposit and booking creation
  // places no second hold.
  depositAmount Decimal @default(0) @db.Decimal(10, 2)
```

- [ ] **Step 4: Add the three `Booking` deposit fields**

In `model Booking`, immediately after the `paymentIntentId String?` block, add:

```prisma
  // Second Stripe PaymentIntent, held (never captured) for the rental's
  // duration and released on a clean return. Separate from paymentIntentId
  // because the rental hold is captured at `confirmed` while the deposit
  // must stay uncaptured — one intent cannot be both.
  depositIntentId String?
  depositStatus   DepositStatus?

  // Snapshot, same reasoning as pricePerDayAtBooking: an owner raising a
  // listing's deposit must not retroactively change what a past booking
  // held. Deliberately NOT part of subtotal/total.
  depositAmount Decimal @default(0) @db.Decimal(10, 2)
```

- [ ] **Step 5: Add the two `Dispute` money fields**

In `model Dispute`, immediately after the `detail String @db.Text` line, add:

```prisma
  // Null = a plain free-text dispute, exactly as before this feature.
  // Non-null = a damage claim against the booking's deposit. Bounded by
  // booking.depositAmount at the service layer (no DB check constraint,
  // matching the Review.rating precedent).
  claimAmount Decimal? @db.Decimal(10, 2)
  // What an admin actually awarded: 0 <= resolvedAmount <= claimAmount.
  // Drives the partial capture at resolution time.
  resolvedAmount Decimal? @db.Decimal(10, 2)
```

- [ ] **Step 6: Run the migration**

Run: `npx prisma migrate dev --name add_security_deposits`
Expected: a new `prisma/migrations/<timestamp>_add_security_deposits/migration.sql` containing `CREATE TYPE "DepositStatus"`, `ALTER TYPE "NotificationType" ADD VALUE 'deposit_released'`, and `ALTER TABLE` statements adding the six columns; then "Your database is now in sync with your schema" and a client regeneration into `generated/prisma`.

Every added column is either nullable or has a default, so no data backfill is needed and existing rows stay valid.

- [ ] **Step 7: Verify the generated client**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exit code 0. All additions are additive; nothing existing breaks.

- [ ] **Step 8: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(deposits): add deposit and claim columns to the schema"
```

---

### Task 2: Partial capture in PaymentsService

**Files:**
- Modify: `src/payments/payments.service.ts`
- Test: `src/payments/payments.service.spec.ts` (appended `describe` block; existing `capture` tests untouched)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `PaymentsService.capture(paymentIntentId: string, amount?: Prisma.Decimal): Promise<void>` — with `amount` omitted, byte-for-byte the same Stripe call as today.

- [ ] **Step 1: Append the failing partial-capture tests**

Append to the end of `src/payments/payments.service.spec.ts`:

```ts
describe('PaymentsService.capture partial', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('captures only the requested amount when one is given', async () => {
    mockStripeClient.paymentIntents.capture.mockResolvedValue({
      id: 'pi_dep_1',
      status: 'succeeded',
    });

    const service = makeService();
    await service.capture('pi_dep_1', new Prisma.Decimal('40.00'));

    expect(mockStripeClient.paymentIntents.capture).toHaveBeenCalledWith(
      'pi_dep_1',
      { amount_to_capture: 4000 },
    );
  });

  it('rounds fractional cents on a partial capture', async () => {
    mockStripeClient.paymentIntents.capture.mockResolvedValue({
      id: 'pi_dep_1',
      status: 'succeeded',
    });

    const service = makeService();
    await service.capture('pi_dep_1', new Prisma.Decimal('12.345'));

    expect(mockStripeClient.paymentIntents.capture).toHaveBeenCalledWith(
      'pi_dep_1',
      { amount_to_capture: 1235 },
    );
  });

  it('still captures in full when no amount is given', async () => {
    mockStripeClient.paymentIntents.capture.mockResolvedValue({
      id: 'pi_dep_1',
      status: 'succeeded',
    });

    const service = makeService();
    await service.capture('pi_dep_1');

    expect(mockStripeClient.paymentIntents.capture).toHaveBeenCalledWith(
      'pi_dep_1',
    );
  });

  it('propagates a partial-capture failure un-caught', async () => {
    mockStripeClient.paymentIntents.capture.mockRejectedValue(
      new Error('amount_to_capture exceeds the authorized amount'),
    );

    const service = makeService();
    await expect(
      service.capture('pi_dep_1', new Prisma.Decimal('999.00')),
    ).rejects.toThrow('amount_to_capture exceeds the authorized amount');
  });
});
```

The "captures in full when no amount is given" test is the regression guard that matters: `BookingsService.updateStatus` calls `capture(id)` with one argument for the rental hold, and that call must keep producing a single-argument Stripe call, not `capture(id, undefined)` or `capture(id, { amount_to_capture: NaN })`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/payments/payments.service.spec.ts -t "capture partial"`
Expected: FAIL — `Expected: "pi_dep_1", {"amount_to_capture": 4000} / Received: "pi_dep_1"`, because the current implementation ignores the second argument.

- [ ] **Step 3: Implement the optional amount**

In `src/payments/payments.service.ts`, replace the `capture` method:

```ts
  async capture(paymentIntentId: string): Promise<void> {
    await this.stripe.paymentIntents.capture(paymentIntentId);
  }
```

with:

```ts
  // Ruling 4: one optional argument instead of a fourth verb. Passing an
  // amount performs a partial capture, and Stripe releases the uncaptured
  // remainder back to the cardholder automatically — which is exactly the
  // "partially claimed deposit" semantic, for free.
  async capture(paymentIntentId: string, amount?: Prisma.Decimal): Promise<void> {
    if (amount === undefined) {
      await this.stripe.paymentIntents.capture(paymentIntentId);
      return;
    }
    await this.stripe.paymentIntents.capture(paymentIntentId, {
      amount_to_capture: Math.round(amount.toNumber() * 100),
    });
  }
```

The `amount === undefined` early return is what keeps the full-capture call shape identical to before. `Prisma` is already imported in this file.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/payments/payments.service.spec.ts`
Expected: PASS — the pre-existing PaymentsService tests plus the 4 new partial-capture tests.

- [ ] **Step 5: Verify nothing else regressed**

Run: `npm test && npx tsc --noEmit -p tsconfig.json`
Expected: all suites PASS, tsc exit code 0. `BookingsService`'s existing `capture(existing.paymentIntentId)` call site compiles unchanged (the new parameter is optional).

- [ ] **Step 6: Commit**

```bash
git add src/payments
git commit -m "feat(payments): support partial capture via an optional amount"
```

---

### Task 3: Hold the deposit at booking creation

**Files:**
- Modify: `src/listings/dto/create-listing.dto.ts`
- Modify: `src/bookings/bookings.service.ts` (imports + `create()`)
- Test: `src/bookings/bookings.service.spec.ts` (appended `describe` block)

**Interfaces:**
- Consumes: `Listing.depositAmount`, `Booking.depositAmount/depositIntentId/depositStatus` from Task 1; `PaymentsService.authorize` and `PaymentsService.release` (unchanged, from item 3).
- Produces: bookings that carry `depositStatus: 'held'` and a `depositIntentId`, which Tasks 4 and 5 act on.

- [ ] **Step 1: Add `depositAmount` to the listing DTO**

In `src/listings/dto/create-listing.dto.ts`, add `Max` and `Min` to the `class-validator` import list, then add after the `pricePerDay` field:

```ts
  // Optional; absent means 0, i.e. this listing takes no deposit. The Max is
  // a fat-finger guard, not a business rule — a mistyped 100000 would place
  // a five-figure hold on a real renter's card.
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10000)
  depositAmount?: number;
```

`UpdateListingDto` is `PartialType(CreateListingDto)` and picks this up with no edit. `ListingsService.create` spreads the whole DTO into `prisma.listing.create`, so no service change is needed either.

- [ ] **Step 2: Append the failing deposit-hold tests**

Append to the end of `src/bookings/bookings.service.spec.ts`:

```ts
describe('BookingsService.create deposit hold', () => {
  const paymentMethod = {
    id: 'pm1',
    userId: 'renter-1',
    processorPaymentMethodId: 'pm_card_visa',
  };
  const dto = {
    listingId: 'l1',
    paymentMethodId: 'pm1',
    pickupMethod: 'pickup' as const,
    startDate: '2026-09-01',
    endDate: '2026-09-03',
  };

  function arrange(depositAmount: number) {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      id: 'l1',
      title: 'Canon R5',
      ownerId: 'owner-1',
      pricePerDay: 100,
      depositAmount: new Prisma.Decimal(depositAmount),
      deletedAt: null,
    });
    (prisma.paymentMethod.findUnique as jest.Mock).mockResolvedValue(
      paymentMethod,
    );
    (prisma.booking.create as jest.Mock).mockResolvedValue({
      id: 'b1',
      requestNumber: 'GL-1',
    });
    return { prisma, notifications, payments };
  }

  it('places a second hold for the deposit and records it on the booking', async () => {
    const { prisma, notifications, payments } = arrange(200);
    (payments.authorize as jest.Mock)
      .mockResolvedValueOnce('pi_rental')
      .mockResolvedValueOnce('pi_deposit');

    const service = new BookingsService(prisma, notifications, payments);
    await service.create('renter-1', dto);

    expect(payments.authorize).toHaveBeenCalledTimes(2);
    const [, depositArg] = (payments.authorize as jest.Mock).mock.calls[1];
    expect(depositArg.toString()).toBe('200');

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          paymentIntentId: 'pi_rental',
          depositIntentId: 'pi_deposit',
          depositStatus: 'held',
        }),
      }),
    );
  });

  it('snapshots the deposit amount onto the booking without touching the total', async () => {
    const { prisma, notifications, payments } = arrange(200);

    const service = new BookingsService(prisma, notifications, payments);
    await service.create('renter-1', dto);

    const { data } = (prisma.booking.create as jest.Mock).mock.calls[0][0];
    expect(data.depositAmount.toString()).toBe('200');
    // 2 nights at 100 => subtotal 200, fee 20, tax 17.60, total 237.60 —
    // unchanged by the deposit (Ruling 1).
    expect(data.total.toString()).toBe('237.6');
  });

  it('places no deposit hold when the listing has no deposit', async () => {
    const { prisma, notifications, payments } = arrange(0);

    const service = new BookingsService(prisma, notifications, payments);
    await service.create('renter-1', dto);

    expect(payments.authorize).toHaveBeenCalledTimes(1);
    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          depositIntentId: null,
          depositStatus: null,
        }),
      }),
    );
  });

  it('releases the rental hold and writes nothing when the deposit hold declines', async () => {
    const { prisma, notifications, payments } = arrange(200);
    (payments.authorize as jest.Mock)
      .mockResolvedValueOnce('pi_rental')
      .mockRejectedValueOnce(
        Object.assign(new Error('Your card was declined.'), {
          type: 'StripeCardError',
          code: 'card_declined',
        }),
      );

    const service = new BookingsService(prisma, notifications, payments);
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      BadRequestException,
    );

    expect(payments.release).toHaveBeenCalledWith('pi_rental');
    expect(prisma.booking.create).not.toHaveBeenCalled();
    expect(notifications.notify).not.toHaveBeenCalled();
  });

  it('reports a declined deposit hold as a card decline', async () => {
    const { prisma, notifications, payments } = arrange(200);
    (payments.authorize as jest.Mock)
      .mockResolvedValueOnce('pi_rental')
      .mockRejectedValueOnce(
        Object.assign(new Error('Your card was declined.'), {
          type: 'StripeCardError',
        }),
      );

    const service = new BookingsService(prisma, notifications, payments);
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      'Card was declined',
    );
  });

  it('still releases the rental hold when a non-card error fails the deposit', async () => {
    const { prisma, notifications, payments } = arrange(200);
    (payments.authorize as jest.Mock)
      .mockResolvedValueOnce('pi_rental')
      .mockRejectedValueOnce(new Error('Stripe is down'));

    const service = new BookingsService(prisma, notifications, payments);
    await expect(service.create('renter-1', dto)).rejects.toThrow(
      'Stripe is down',
    );

    expect(payments.release).toHaveBeenCalledWith('pi_rental');
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });
});
```

The pre-existing `BookingsService.create` tests use listing fixtures with no `depositAmount` key at all (`undefined`). That is deliberate and must keep passing — it is the same shape a pre-migration row has, and the implementation's `?? 0` coalesce is what makes it work.

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- src/bookings/bookings.service.spec.ts -t "deposit hold"`
Expected: FAIL — `expect(payments.authorize).toHaveBeenCalledTimes(2) / Received number of calls: 1`.

- [ ] **Step 4: Implement the deposit hold in `create()`**

In `src/bookings/bookings.service.ts`, add the Prisma import after the existing imports:

```ts
import { Prisma } from '../../generated/prisma/client';
```

Then, in `create()`, immediately after the existing rental-hold `try/catch` block (the one ending with `throw err; }` around `this.payments.authorize(...)`) and before the `try {` that wraps `prisma.booking.create`, insert:

```ts
    // Ruling 2: snapshot the listing's deposit onto the booking. `?? 0`
    // covers listings written before this column existed.
    const depositAmount = new Prisma.Decimal(listing.depositAmount ?? 0);

    // Ruling 3: the deposit is a SECOND hold, placed here rather than at
    // confirm so there is one card interaction and one failure path. It is
    // never captured on confirm — it stays authorized until the return.
    //
    // ponytail: a Stripe auth-hold lapses after roughly 7 days, so a deposit
    // for a booking that starts three weeks out will have expired before the
    // handover. Upgrade path when this bites: a scheduled job that
    // re-authorizes before the start date, or `extended_authorization` on the
    // card networks that support it. Both need a scheduler this codebase
    // does not have yet.
    let depositIntentId: string | null = null;
    if (depositAmount.gt(0)) {
      try {
        depositIntentId = await this.payments.authorize(
          paymentMethod.processorPaymentMethodId,
          depositAmount,
        );
      } catch (err) {
        // The rental hold succeeded moments ago and this booking is not
        // going to exist. Release it or the renter is left with an orphaned
        // hold. Best-effort: the original error is what the caller needs.
        await this.payments.release(paymentIntentId).catch(() => {});
        if ((err as { type?: string })?.type === 'StripeCardError') {
          throw new BadRequestException('Card was declined');
        }
        throw err;
      }
    }
```

Then extend the `booking.create` data payload, immediately after `paymentIntentId,`:

```ts
          paymentIntentId,
          depositAmount,
          depositIntentId,
          depositStatus: depositIntentId ? 'held' : null,
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- src/bookings/bookings.service.spec.ts`
Expected: PASS — all pre-existing bookings tests plus the 6 new deposit-hold tests.

- [ ] **Step 6: Verify types and lint**

Run: `npx tsc --noEmit -p tsconfig.json && npm run lint`
Expected: exit code 0, eslint clean.

- [ ] **Step 7: Commit**

```bash
git add src/listings/dto/create-listing.dto.ts src/bookings/bookings.service.ts src/bookings/bookings.service.spec.ts
git commit -m "feat(deposits): hold a security deposit when a booking is created"
```

---

### Task 4: Release the deposit on a clean return or a cancellation

**Files:**
- Modify: `src/bookings/bookings.service.ts` (`updateStatus()`)
- Test: `src/bookings/bookings.service.spec.ts` (appended `describe` block)

**Interfaces:**
- Consumes: `depositStatus`/`depositIntentId` written by Task 3; `PaymentsService.release`; `NotificationType.deposit_released` from Task 1.
- Produces: bookings whose deposit reaches `released`; leaves `held` intact when a dispute exists, which Task 5 then resolves.

- [ ] **Step 1: Append the failing release tests**

Append to the end of `src/bookings/bookings.service.spec.ts`:

```ts
describe('BookingsService.updateStatus deposit release', () => {
  const heldBooking = {
    id: 'b1',
    requestNumber: 'GL-1',
    listingId: 'l1',
    renterId: 'renter-1',
    status: 'confirmed',
    paymentIntentId: 'pi_rental',
    depositIntentId: 'pi_deposit',
    depositStatus: 'held',
    startDate: new Date('2026-09-01'),
    endDate: new Date('2026-09-03'),
    listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
    dispute: null,
  };

  function arrange(overrides: Record<string, unknown> = {}) {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    const booking = { ...heldBooking, ...overrides };
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(booking);
    (prisma.booking.findUniqueOrThrow as jest.Mock).mockResolvedValue(booking);
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'completed',
    });
    return { prisma, notifications, payments };
  }

  it('releases the deposit when the owner completes a booking with no dispute', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new BookingsService(prisma, notifications, payments);
    await service.updateStatus('b1', 'owner-1', { status: 'completed' });

    expect(payments.release).toHaveBeenCalledWith('pi_deposit');
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'released' }),
      }),
    );
  });

  it('notifies the renter that the deposit was released', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new BookingsService(prisma, notifications, payments);
    await service.updateStatus('b1', 'owner-1', { status: 'completed' });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'deposit_released',
      'Your security deposit for Canon R5 was released',
      'The hold on your card for booking GL-1 has been released.',
      '/bookings/b1',
    );
  });

  it('releases money before writing the row', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new BookingsService(prisma, notifications, payments);
    await service.updateStatus('b1', 'owner-1', { status: 'completed' });

    expect(
      (payments.release as jest.Mock).mock.invocationCallOrder[0],
    ).toBeLessThan(
      (prisma.booking.update as jest.Mock).mock.invocationCallOrder[0],
    );
  });

  it('keeps the deposit held when the booking has a dispute', async () => {
    const { prisma, notifications, payments } = arrange({
      dispute: { id: 'd1', status: 'flagged' },
    });

    const service = new BookingsService(prisma, notifications, payments);
    await service.updateStatus('b1', 'owner-1', { status: 'completed' });

    expect(payments.release).not.toHaveBeenCalled();
    const { data } = (prisma.booking.update as jest.Mock).mock.calls[0][0];
    expect(data.depositStatus).toBeUndefined();
  });

  it('refuses to let the renter complete a booking', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new BookingsService(prisma, notifications, payments);
    await expect(
      service.updateStatus('b1', 'renter-1', { status: 'completed' }),
    ).rejects.toThrow('Only the owner can complete a booking');

    expect(payments.release).not.toHaveBeenCalled();
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it('releases the deposit alongside the rental hold on cancellation', async () => {
    const { prisma, notifications, payments } = arrange();
    (prisma.booking.update as jest.Mock).mockResolvedValue({
      id: 'b1',
      status: 'cancelled',
    });

    const service = new BookingsService(prisma, notifications, payments);
    await service.updateStatus('b1', 'renter-1', { status: 'cancelled' });

    expect(payments.release).toHaveBeenCalledWith('pi_rental');
    expect(payments.release).toHaveBeenCalledWith('pi_deposit');
  });

  it('blocks the transition when the deposit release fails', async () => {
    const { prisma, notifications, payments } = arrange();
    (payments.release as jest.Mock).mockRejectedValue(new Error('Stripe down'));

    const service = new BookingsService(prisma, notifications, payments);
    await expect(
      service.updateStatus('b1', 'owner-1', { status: 'completed' }),
    ).rejects.toThrow('Deposit could not be released');

    expect(prisma.booking.update).not.toHaveBeenCalled();
    expect(notifications.notify).not.toHaveBeenCalled();
  });

  it('does nothing deposit-related for a zero-deposit booking', async () => {
    const { prisma, notifications, payments } = arrange({
      depositIntentId: null,
      depositStatus: null,
    });

    const service = new BookingsService(prisma, notifications, payments);
    await service.updateStatus('b1', 'owner-1', { status: 'completed' });

    expect(payments.release).not.toHaveBeenCalled();
    expect(notifications.notify).not.toHaveBeenCalled();
    expect(prisma.booking.update).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/bookings/bookings.service.spec.ts -t "deposit release"`
Expected: FAIL — `expect(payments.release).toHaveBeenCalledWith("pi_deposit") / Number of calls: 0`, and the renter-completes test resolving instead of rejecting.

- [ ] **Step 3: Include the dispute in the booking lookup**

`updateStatus` calls `this.findById(id)`, which must now report whether a dispute exists. In `src/bookings/bookings.service.ts`, change `findById`'s include:

```ts
      include: { listing: true, renter: { select: RENTER_SELECT } },
```

to:

```ts
      // `dispute` is here for the deposit-release decision in updateStatus:
      // a clean return releases, a disputed one keeps the money held.
      include: {
        listing: true,
        renter: { select: RENTER_SELECT },
        dispute: true,
      },
```

This is the existing fetch, not a third one — the same reuse the notifications feature made when it added `listing` here.

- [ ] **Step 4: Add the owner-only guard and the release logic**

In `updateStatus`, immediately after the existing party check (`if (existing.renterId !== userId && ...) throw new ForbiddenException(...)`), add:

```ts
    // Ruling 6: completing a booking is what releases the deposit, so
    // leaving this open to the renter would let them release their own
    // deposit before the owner has looked at the gear. Money-security
    // boundary, not polish.
    if (dto.status === 'completed' && existing.listing.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can complete a booking');
    }
```

Then, immediately after the existing `if (dto.status === 'cancelled') { ... }` rental-release block and before the `payoutStatus` ternary, add:

```ts
    // Ruling 7: "clean return" == completed with no dispute on the booking.
    // A cancellation always releases. Anything else leaves the hold alone.
    const releasesDeposit =
      existing.depositStatus === 'held' &&
      (dto.status === 'cancelled' ||
        (dto.status === 'completed' && !existing.dispute));

    if (releasesDeposit) {
      try {
        if (!existing.depositIntentId) {
          throw new Error('booking has no deposit intent to release');
        }
        await this.payments.release(existing.depositIntentId);
      } catch (err) {
        throw new ConflictException('Deposit could not be released', {
          cause: err,
        });
      }
    }
```

Extend the `booking.update` data payload so it reads:

```ts
        data: {
          status: dto.status,
          ...(payoutStatus !== undefined && { payoutStatus }),
          ...(releasesDeposit && { depositStatus: 'released' as const }),
        },
```

Finally, after the existing `confirmed`/`cancelled` notification block inside the same `try`, add:

```ts
      if (releasesDeposit) {
        await this.notifications.notify(
          existing.renterId,
          'deposit_released',
          `Your security deposit for ${existing.listing.title} was released`,
          `The hold on your card for booking ${existing.requestNumber} has been released.`,
          `/bookings/${id}`,
        );
      }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- src/bookings/bookings.service.spec.ts`
Expected: PASS — all pre-existing bookings tests plus the 8 new release tests.

Two notes on the pre-existing tests:

- Their `updateStatus` fixtures have no `depositStatus` key, so `existing.depositStatus === 'held'` is `false` and none of the new deposit logic runs for them. No edit needed.
- `'touches no payment call when completing a booking'` (`src/bookings/bookings.service.spec.ts:419`) calls `service.updateStatus('b1', 'renter-1', { status: 'completed' })`, which the new owner-only guard now rejects. This is the one required mechanical edit in this task: change that single caller id from `'renter-1'` to `'owner-1'`. Its fixture's `listing.ownerId` is already `'owner-1'`, and none of its three assertions change — the test still proves that completing touches no payment call.

- [ ] **Step 6: Verify the whole suite, types, and lint**

Run: `npm test && npx tsc --noEmit -p tsconfig.json && npm run lint`
Expected: all suites PASS, tsc exit code 0, eslint clean.

- [ ] **Step 7: Commit**

```bash
git add src/bookings/bookings.service.ts src/bookings/bookings.service.spec.ts
git commit -m "feat(deposits): release the deposit on a clean return or cancellation"
```

---

### Task 5: Damage claims against the deposit

**Files:**
- Modify: `src/disputes/dto/create-dispute.dto.ts`
- Modify: `src/disputes/dto/update-dispute-status.dto.ts`
- Modify: `src/disputes/disputes.service.ts`
- Modify: `src/disputes/disputes.module.ts`
- Test: `src/disputes/disputes.service.spec.ts` (mechanical constructor edits + appended `describe` blocks)

**Interfaces:**
- Consumes: `Dispute.claimAmount`/`resolvedAmount` from Task 1; `PaymentsService.capture(id, amount?)` from Task 2; `Booking.depositStatus`/`depositIntentId`/`depositAmount` from Task 3.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add `claimAmount` to the create DTO**

In `src/disputes/dto/create-dispute.dto.ts`, add `IsNumber`, `IsOptional`, and `IsPositive` to the `class-validator` import and append:

```ts
  // Optional. Absent = today's free-text dispute, unchanged. Present = a
  // damage claim against the booking's deposit; owner-only, and bounded by
  // booking.depositAmount in the service.
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  claimAmount?: number;
```

- [ ] **Step 2: Add `resolvedAmount` to the status DTO**

In `src/disputes/dto/update-dispute-status.dto.ts`, add the imports and append:

```ts
  // What the admin awards the owner out of the deposit, 0 <= this <=
  // claimAmount. Only meaningful alongside status: 'resolved'. Omitting it
  // on a claim dispute resolves in the renter's favour: full release.
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  resolvedAmount?: number;
```

- [ ] **Step 3: Do the mechanical spec edits**

In `src/disputes/disputes.service.spec.ts`:

Add the import:

```ts
import { PaymentsService } from '../payments/payments.service';
```

Add this helper immediately after `makeNotifications()`:

```ts
function makePayments() {
  return {
    authorize: jest.fn().mockResolvedValue('pi_test_1'),
    capture: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
  } as unknown as PaymentsService;
}
```

Replace all 4 occurrences of

```ts
    const service = new DisputesService(prisma, notifications);
```

with

```ts
    const service = new DisputesService(prisma, notifications, makePayments());
```

No assertion in those 4 tests changes.

- [ ] **Step 4: Append the failing claim tests**

Append to the end of `src/disputes/disputes.service.spec.ts`:

```ts
const depositBooking = {
  id: 'b1',
  requestNumber: 'GL-1',
  status: 'completed',
  renterId: 'renter-1',
  depositAmount: new Prisma.Decimal('200.00'),
  depositIntentId: 'pi_deposit',
  depositStatus: 'held',
  listing: { id: 'l1', title: 'Canon R5', ownerId: 'owner-1' },
};

describe('DisputesService.create damage claims', () => {
  function arrange(bookingOverrides: Record<string, unknown> = {}) {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
      ...depositBooking,
      ...bookingOverrides,
    });
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.dispute.create as jest.Mock).mockResolvedValue({ id: 'd1' });
    return { prisma, notifications, payments };
  }

  it('records the claim amount on the dispute', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.create('owner-1', {
      bookingId: 'b1',
      detail: 'Lens barrel dented',
      claimAmount: 80,
    });

    expect(prisma.dispute.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ claimAmount: 80 }),
      }),
    );
  });

  it('refuses a claim from the renter', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.create('renter-1', {
        bookingId: 'b1',
        detail: 'nope',
        claimAmount: 80,
      }),
    ).rejects.toThrow('Only the owner can claim against the deposit');

    expect(prisma.dispute.create).not.toHaveBeenCalled();
  });

  it('still lets the renter file a claimless dispute', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.create('renter-1', {
      bookingId: 'b1',
      detail: 'Gear was filthy',
    });

    expect(prisma.dispute.create).toHaveBeenCalled();
  });

  it('refuses a claim when no deposit is held', async () => {
    const { prisma, notifications, payments } = arrange({
      depositStatus: null,
      depositIntentId: null,
      depositAmount: new Prisma.Decimal(0),
    });

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.create('owner-1', {
        bookingId: 'b1',
        detail: 'Dented',
        claimAmount: 80,
      }),
    ).rejects.toThrow('No deposit is held for this booking');
  });

  it('refuses a claim when the deposit was already released', async () => {
    const { prisma, notifications, payments } = arrange({
      depositStatus: 'released',
    });

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.create('owner-1', {
        bookingId: 'b1',
        detail: 'Dented',
        claimAmount: 80,
      }),
    ).rejects.toThrow('No deposit is held for this booking');
  });

  it('refuses a claim larger than the deposit held', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.create('owner-1', {
        bookingId: 'b1',
        detail: 'Totalled',
        claimAmount: 500,
      }),
    ).rejects.toThrow('Claim exceeds the deposit held');
  });

  it('allows a claim for exactly the deposit held', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.create('owner-1', {
      bookingId: 'b1',
      detail: 'Totalled',
      claimAmount: 200,
    });

    expect(prisma.dispute.create).toHaveBeenCalled();
  });

  it('tells the renter what is being claimed', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.create('owner-1', {
      bookingId: 'b1',
      detail: 'Lens barrel dented',
      claimAmount: 80,
    });

    expect(notifications.notify).toHaveBeenCalledWith(
      'renter-1',
      'dispute_filed',
      'A dispute was filed for booking GL-1',
      'A claim of 80 against your deposit: Lens barrel dented',
      '/disputes/d1',
    );
  });
});

describe('DisputesService.updateStatus deposit resolution', () => {
  function arrange(disputeOverrides: Record<string, unknown> = {}) {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    const payments = makePayments();
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue({
      id: 'd1',
      status: 'under_review',
      bookingId: 'b1',
      claimAmount: new Prisma.Decimal('80.00'),
      booking: depositBooking,
      ...disputeOverrides,
    });
    (prisma.dispute.update as jest.Mock).mockResolvedValue({
      id: 'd1',
      status: 'resolved',
    });
    return { prisma, notifications, payments };
  }

  it('captures a partial award and marks the deposit partially claimed', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', { status: 'resolved', resolvedAmount: 40 });

    const [intentId, amount] = (payments.capture as jest.Mock).mock.calls[0];
    expect(intentId).toBe('pi_deposit');
    expect(amount.toString()).toBe('40');
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'partially_claimed' }),
      }),
    );
  });

  it('marks the deposit fully claimed when the award equals it', async () => {
    const { prisma, notifications, payments } = arrange({
      claimAmount: new Prisma.Decimal('200.00'),
    });

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', {
      status: 'resolved',
      resolvedAmount: 200,
    });

    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'claimed' }),
      }),
    );
  });

  it('releases the whole deposit when the award is zero', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', { status: 'resolved', resolvedAmount: 0 });

    expect(payments.release).toHaveBeenCalledWith('pi_deposit');
    expect(payments.capture).not.toHaveBeenCalled();
    expect(prisma.booking.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ depositStatus: 'released' }),
      }),
    );
  });

  it('releases the whole deposit when no award is given', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', { status: 'resolved' });

    expect(payments.release).toHaveBeenCalledWith('pi_deposit');
    expect(payments.capture).not.toHaveBeenCalled();
  });

  it('records the resolved amount on the dispute', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', { status: 'resolved', resolvedAmount: 40 });

    expect(prisma.dispute.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ resolvedAmount: 40 }),
      }),
    );
  });

  it('refuses an award larger than the amount claimed', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.updateStatus('d1', { status: 'resolved', resolvedAmount: 150 }),
    ).rejects.toThrow('Resolution exceeds the amount claimed');

    expect(payments.capture).not.toHaveBeenCalled();
    expect(prisma.dispute.update).not.toHaveBeenCalled();
  });

  it('refuses an award on a dispute with no claim', async () => {
    const { prisma, notifications, payments } = arrange({ claimAmount: null });

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.updateStatus('d1', { status: 'resolved', resolvedAmount: 40 }),
    ).rejects.toThrow('This dispute has no claim to resolve');
  });

  it('leaves a claimless dispute resolution completely untouched', async () => {
    const { prisma, notifications, payments } = arrange({ claimAmount: null });

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', { status: 'resolved' });

    expect(payments.capture).not.toHaveBeenCalled();
    expect(payments.release).not.toHaveBeenCalled();
    expect(prisma.dispute.update).toHaveBeenCalled();
  });

  it('does not resolve the dispute when the capture fails', async () => {
    const { prisma, notifications, payments } = arrange();
    (payments.capture as jest.Mock).mockRejectedValue(new Error('Stripe down'));

    const service = new DisputesService(prisma, notifications, payments);
    await expect(
      service.updateStatus('d1', { status: 'resolved', resolvedAmount: 40 }),
    ).rejects.toThrow('Deposit could not be claimed');

    expect(prisma.dispute.update).not.toHaveBeenCalled();
    expect(notifications.notify).not.toHaveBeenCalled();
  });

  it('touches no money when the status is not resolved', async () => {
    const { prisma, notifications, payments } = arrange();

    const service = new DisputesService(prisma, notifications, payments);
    await service.updateStatus('d1', { status: 'under_review' });

    expect(payments.capture).not.toHaveBeenCalled();
    expect(payments.release).not.toHaveBeenCalled();
  });
});
```

Add to the spec file's imports:

```ts
import { Prisma } from '../../generated/prisma/client';
```

and add `update: jest.fn()` to the `booking` block of `makePrisma()` if it is not already there (it is — `makePrisma` already mocks `booking.update` for the existing `payoutStatus` transaction).

- [ ] **Step 5: Run tests to verify they fail**

Run: `npm test -- src/disputes/disputes.service.spec.ts`
Expected: FAIL — TypeScript error "Expected 2 arguments, but got 3" on the `new DisputesService(...)` calls.

- [ ] **Step 6: Inject `PaymentsService` into `DisputesService`**

In `src/disputes/disputes.service.ts`, add the imports:

```ts
import { BadRequestException } from '@nestjs/common'; // add to the existing @nestjs/common import list
import { Prisma } from '../../generated/prisma/client';
import { PaymentsService } from '../payments/payments.service';
```

and change the constructor to:

```ts
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly payments: PaymentsService,
  ) {}
```

In `src/disputes/disputes.module.ts`, add `PaymentsModule` to the imports array:

```ts
import { PaymentsModule } from '../payments/payments.module';
// ...
  imports: [AuthModule, NotificationsModule, PaymentsModule],
```

`src/app.module.ts` stays untouched — Nest resolves `PaymentsModule` through this import, exactly as it already does for `BookingsModule`.

- [ ] **Step 7: Validate the claim in `create()`**

In `DisputesService.create`, immediately after the existing "a dispute already exists" check and before the `$transaction`, insert:

```ts
    // Ruling 5/6: a claim is the same Dispute row with money attached, and
    // only the owner has damage to claim. A claimless dispute keeps the
    // existing either-party rule untouched.
    if (dto.claimAmount !== undefined) {
      if (booking.listing.ownerId !== userId) {
        throw new ForbiddenException(
          'Only the owner can claim against the deposit',
        );
      }
      // One check covers "no deposit was ever taken", "already released"
      // and "already claimed".
      if (booking.depositStatus !== 'held') {
        throw new ConflictException('No deposit is held for this booking');
      }
      if (new Prisma.Decimal(dto.claimAmount).gt(booking.depositAmount)) {
        throw new BadRequestException('Claim exceeds the deposit held');
      }
    }
```

Add `claimAmount` to the `dispute.create` data:

```ts
        data: {
          bookingId: dto.bookingId,
          detail: dto.detail,
          claimAmount: dto.claimAmount,
        },
```

And make the notification body carry the amount — replace the `dto.detail` argument to `notify` with:

```ts
      dto.claimAmount !== undefined
        ? `A claim of ${dto.claimAmount} against your deposit: ${dto.detail}`
        : dto.detail,
```

- [ ] **Step 8: Settle the deposit in `updateStatus()`**

In `DisputesService.updateStatus`, immediately after `const dispute = await this.findById(id);`, insert:

```ts
    // Money moves before the row changes: a Stripe failure must leave the
    // dispute unresolved rather than marked resolved with the funds stuck.
    let depositStatus: 'released' | 'claimed' | 'partially_claimed' | undefined;

    if (dto.status === 'resolved' && dispute.claimAmount !== null) {
      const awarded = new Prisma.Decimal(dto.resolvedAmount ?? 0);
      if (awarded.gt(dispute.claimAmount)) {
        throw new BadRequestException('Resolution exceeds the amount claimed');
      }

      try {
        if (!dispute.booking.depositIntentId) {
          throw new Error('booking has no deposit intent to settle');
        }
        if (awarded.gt(0)) {
          // Partial capture: Stripe releases the uncaptured remainder to the
          // renter automatically, which is the partially_claimed semantic.
          await this.payments.capture(
            dispute.booking.depositIntentId,
            awarded,
          );
          depositStatus = awarded.equals(dispute.booking.depositAmount)
            ? 'claimed'
            : 'partially_claimed';
        } else {
          // Ruling 8: silence means no damage awarded — the safe default for
          // the party who isn't in the room.
          await this.payments.release(dispute.booking.depositIntentId);
          depositStatus = 'released';
        }
      } catch (err) {
        throw new ConflictException('Deposit could not be claimed', {
          cause: err,
        });
      }
    } else if (dto.resolvedAmount !== undefined && dispute.claimAmount === null) {
      throw new BadRequestException('This dispute has no claim to resolve');
    }
```

Then write both amounts and the deposit status. In the `resolved`-and-not-cancelled `$transaction` branch, extend the dispute update and add a booking-deposit write:

```ts
      const [updated] = await this.prisma.$transaction([
        this.prisma.dispute.update({
          where: { id },
          data: { status: dto.status, resolvedAmount: dto.resolvedAmount },
        }),
        this.prisma.booking.update({
          where: { id: dispute.bookingId },
          data: {
            payoutStatus: 'pending',
            ...(depositStatus && { depositStatus }),
          },
        }),
      ]);
```

And in the fall-through branch below it, replace the plain update with:

```ts
    const updated = await this.prisma.$transaction(async (tx) => {
      const d = await tx.dispute.update({
        where: { id },
        data: { status: dto.status, resolvedAmount: dto.resolvedAmount },
      });
      if (depositStatus) {
        await tx.booking.update({
          where: { id: dispute.bookingId },
          data: { depositStatus },
        });
      }
      return d;
    });
```

`makePrisma()`'s `$transaction` mock already handles the array form; add the callback form to it if the tests demand it:

```ts
    $transaction: jest.fn((arg: unknown) =>
      typeof arg === 'function'
        ? (arg as (tx: unknown) => unknown)({
            dispute: { update: jest.fn().mockResolvedValue({ id: 'd1' }) },
            booking: { update: jest.fn() },
          })
        : Promise.all(arg as unknown[]),
    ),
```

If that mock complexity outgrows its value, collapse both branches into the single callback form so there is one shape to mock — that is the simpler end state and is worth taking if the array/callback split causes any test friction here.

- [ ] **Step 9: Run tests to verify they pass**

Run: `npm test -- src/disputes/disputes.service.spec.ts`
Expected: PASS — the 4 pre-existing notification tests plus 8 claim-creation tests plus 10 resolution tests.

- [ ] **Step 10: Run the full suite, types, and lint**

Run: `npm test && npx tsc --noEmit -p tsconfig.json && npm run lint`
Expected: all suites PASS, tsc exit code 0, eslint clean.

- [ ] **Step 11: Verify DI resolves at runtime**

Run: `npm run start` and wait for the startup log, then Ctrl-C.
Expected: Nest logs `DisputesModule dependencies initialized` and maps the `/disputes` and `/admin/disputes` routes, with no `Nest can't resolve dependencies of the DisputesService` error.

- [ ] **Step 12: Commit**

```bash
git add src/disputes
git commit -m "feat(deposits): claim against a held deposit and settle it on resolution"
```

---

## Self-Review

**Spec coverage**

| Spec section | Task |
| --- | --- |
| `DepositStatus` enum | Task 1, Step 1 |
| `NotificationType.deposit_released` | Task 1, Step 2 |
| `Listing.depositAmount` (Ruling 2) | Task 1, Step 3 |
| `Booking.depositAmount` / `depositIntentId` / `depositStatus` | Task 1, Step 4 |
| `Dispute.claimAmount` / `resolvedAmount` (Ruling 5) | Task 1, Step 5 |
| One migration | Task 1, Step 6 |
| `PaymentsService.capture` optional amount (Ruling 4) | Task 2, Step 3 |
| Second hold at booking create (Rulings 1, 3) | Task 3, Step 4 |
| `depositAmount = 0` places no hold | Task 3, Steps 2 & 4 |
| Rental hold released when the deposit hold fails | Task 3, Step 4 |
| `ponytail:` comment on the ~7-day auth window | Task 3, Step 4 |
| `depositAmount` on the listing DTO, `Min(0)`/`Max(10000)` | Task 3, Step 1 |
| Release on `completed` with no dispute (Ruling 7) | Task 4, Step 4 |
| Deposit stays held when a dispute exists | Task 4, Steps 1 & 4 |
| Release on `cancelled` | Task 4, Step 4 |
| Owner-only `completed` (Ruling 6) | Task 4, Step 4 |
| `'Deposit could not be released'` blocks the transition | Task 4, Step 4 |
| `deposit_released` notification to the renter | Task 4, Step 4 |
| Owner-only claim, deposit-must-be-held, `claimAmount <= depositAmount` | Task 5, Step 7 |
| Renter's claimless dispute unchanged | Task 5, Steps 4 & 7 |
| `resolvedAmount` bounds and the no-claim rejection | Task 5, Step 8 |
| Partial capture → `partially_claimed`, full → `claimed`, zero/absent → `released` | Task 5, Step 8 |
| Money before the row write, `'Deposit could not be claimed'` | Task 5, Step 8 |
| `DisputesModule` imports `PaymentsModule`, `app.module.ts` untouched | Task 5, Step 6 |
| Out of scope: handoff photos, auto-release job, re-auth, counter-claims, refund tiers, payouts | Not implemented anywhere; restated in Global Constraints |

**Placeholder scan:** no "TBD", "TODO", "implement later", "add appropriate error handling", "similar to Task N", or test steps without test bodies. Every code step contains complete, paste-ready content.

**Type consistency:**
- `Listing.depositAmount` and `Booking.depositAmount` are non-nullable `Prisma.Decimal` with a DB default, so `create()` never has to null-check them — but `listing.depositAmount ?? 0` is kept anyway, because a mocked or pre-migration listing object can lack the key at runtime even when the type says it cannot.
- `Dispute.claimAmount` / `resolvedAmount` are `Prisma.Decimal | null`. `dispute.claimAmount !== null` is the discriminator that separates a claim from a plain dispute, and `strictNullChecks` makes it a compile requirement before `awarded.gt(dispute.claimAmount)`.
- `booking.depositIntentId` is `string | null`, so the null-guard before `capture`/`release` is a type requirement, not optional polish — identical to the `paymentIntentId` guard item 3 already established.
- `PaymentsService.capture(id, amount?)` is source-compatible with the existing single-argument call in `BookingsService.updateStatus`; Task 2's third test is the regression guard for that.
- DTO amounts arrive as `number` and are wrapped in `new Prisma.Decimal(...)` before any comparison or Stripe call. Prisma accepts a bare `number` for a `Decimal` column, so the `data:` payloads pass `dto.claimAmount` / `dto.resolvedAmount` through unwrapped and the tests assert on the number.

**Judgment calls made where the spec was silent** (each is annotated in the code above):
1. **The deposit-hold failure releases the rental hold** via the same best-effort `.catch(() => {})` pattern `create()` already uses for its exclusion-violation path. Reporting the cleanup failure instead of the original error would hide the reason the booking failed.
2. **`updateStatus` reuses the existing `findById` fetch** to learn whether a dispute exists (adding `dispute: true` to its include) rather than issuing a third booking query — the same reuse the notifications feature made when it added `listing` to that include.
3. **A missing `resolvedAmount` means full release, not "leave it held."** Leaving money held on a resolved dispute would make `resolved` a lie and strand the renter's funds with no remaining action that frees them.
4. **`depositStatus` is written in the same `$transaction` as the dispute update**, so a resolved dispute and a settled deposit commit together. The Stripe call is deliberately outside that transaction — it cannot be rolled back, which is exactly why it goes first.
5. **The claim amount appears in the renter's notification body** rather than only in the dispute detail. A renter told "a dispute was filed" while $80 is being taken from their deposit has not actually been told the thing that matters.
6. **No admin-side ownership check on `resolvedAmount`** beyond the existing `JwtAdminAuthGuard` on `AdminDisputesController` — resolution is already an admin-only surface and Ruling 8 puts the decision there.
7. **`Max(10000)` on `depositAmount`** is a number picked as a plausible ceiling for consumer gear, not a researched limit. It exists to stop a typo, and is the kind of value a product decision should later replace.
