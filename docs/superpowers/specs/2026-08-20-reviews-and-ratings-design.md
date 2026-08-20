# Reviews & ratings — design

Part of [gearloop-feature-ideas.md](../../gearloop-feature-ideas.md) Tier 1, item 1. Scoped to the review system only — `User.responseTime` (computed from message reply latency) is a separate, later task.

## Problem

There is no `Review` model. Trust is the core product for P2P gear rental and nothing currently lets a renter rate gear/owner or an owner rate a renter.

## Data model

One `Review` model covers both directions — not two separate tables — distinguished by a `direction` enum rather than by comparing `authorId` to `booking.renterId` at query time.

```prisma
enum ReviewDirection {
  renter_to_owner
  owner_to_renter
}

model Review {
  id        String          @id @default(uuid())
  rating    Int             // 1-5, validated at the DTO layer (no DB check constraint)
  comment   String?         @db.Text
  direction ReviewDirection
  createdAt DateTime        @default(now())

  bookingId String
  booking   Booking @relation(fields: [bookingId], references: [id])

  authorId  String
  author    User @relation("ReviewsAuthored", fields: [authorId], references: [id])

  revieweeId String
  reviewee   User @relation("ReviewsReceived", fields: [revieweeId], references: [id])

  @@unique([bookingId, direction])
  @@map("reviews")
}
```

`User` gains two back-relations: `reviewsAuthored Review[] @relation("ReviewsAuthored")` and `reviewsReceived Review[] @relation("ReviewsReceived")`.

Why `direction` instead of inferring the pair from `authorId`/`booking.renterId`:
- Makes "one review per side per booking" a database-enforced unique constraint (`@@unique([bookingId, direction])`), not an app-level check that can race.
- Makes "all reviews about this listing" or "all reviews about this owner" a plain `direction: renter_to_owner` filter joined through `booking`, instead of a per-row comparison.

The renter's review stands for both "gear" and "owner" — there is no separate gear-only rating field. It surfaces on the listing page via `booking.listing`, satisfying the doc's "renter rates gear + owner" without a second review row.

Ratings are **not** denormalized onto `Listing` or `User`. Aggregates (`GET /listings/:id/reviews`, `GET /users/:id/reviews`) compute the average live via `prisma.review.aggregate({ _avg: { rating: true } })`, matching how listing availability is already derived live from bookings rather than stored. No write-path recalculation, no drift risk if a review is ever removed by admin later.

Reviews are visible immediately on submission — no double-blind/reveal-window mechanism.

## API

New `ReviewsModule` (`src/reviews/`), mirroring the shape of the existing `DisputesModule`:

- `POST /bookings/:bookingId/reviews` — auth required. Body: `{ rating: number, comment?: string }`. The server infers `direction` from whether the caller is `booking.renterId` (→ `renter_to_owner`) or `booking.listing.ownerId` (→ `owner_to_renter`); the client never sends `direction` or `revieweeId`.
- `GET /bookings/:bookingId/reviews` — auth required, caller must be a party to the booking. Returns whichever of the (up to two) reviews exist for that booking.
- `GET /listings/:listingId/reviews` — public. Returns `renter_to_owner` reviews for bookings on that listing, plus a live-aggregated average and count.
- `GET /users/:userId/reviews` — public. Returns reviews received (both directions), plus a live-aggregated average and count.

## Validation rules (service layer)

Same pattern as `DisputesService.create`:

1. Booking must exist and `status === 'completed'` → else `NotFoundException` / `ConflictException`.
2. Caller must be `booking.renterId` or `booking.listing.ownerId` → else `ForbiddenException`.
3. One review per direction per booking — pre-check plus reliance on the unique constraint → `ConflictException` on duplicate.
4. `rating`: `@IsInt() @Min(1) @Max(5)`. `comment`: optional string.

## Files

- `prisma/schema.prisma` — add `ReviewDirection` enum, `Review` model, two back-relations on `User`. One migration.
- `src/reviews/reviews.module.ts`
- `src/reviews/reviews.controller.ts`
- `src/reviews/reviews.service.ts`
- `src/reviews/dto/create-review.dto.ts`
- `src/reviews/reviews.service.spec.ts` — create happy path, non-completed-booking rejection, non-party rejection, duplicate-direction rejection.
- `src/app.module.ts` — register `ReviewsModule`.

## Out of scope

- `User.responseTime` computed field (separate task, different data source).
- Review editing/deletion (immutable once submitted; admin can hard-delete later via existing admin tooling if ever needed).
- Double-blind/reveal-window visibility.
- Denormalized rating storage.
