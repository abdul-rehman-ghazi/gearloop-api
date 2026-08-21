# Handoff condition photos — design

Part of [gearloop-feature-ideas.md](../../gearloop-feature-ideas.md) Tier 1, item 5: "Timestamped photos at pickup and return, from both parties. This is what makes claims in #4 resolvable instead of he-said-she-said, and it prevents most disputes from starting."

Design decisions below were made autonomously. Each is logged as a ruling.

## Problem

An owner files a damage claim against a held deposit (item 4, merged) and an admin sets `resolvedAmount` with nothing in front of them but two paragraphs of free text. `Dispute.detail` says "lens barrel dented"; the renter says it arrived that way; there is no record of what the gear looked like when it changed hands, in either direction. Nothing in the schema stores a photo of a booking — `Listing.images` is the only image field in the whole database and it belongs to the listing, not the handover.

## Depends on

**Item 4 (security deposit + damage claims) — merged and in the codebase.** Verified, not assumed: `Booking.depositAmount`/`depositIntentId`/`depositStatus` and `Dispute.claimAmount`/`resolvedAmount` are in `prisma/schema.prisma`; `DisputesService` injects `PaymentsService` and settles the deposit on resolve (`src/disputes/disputes.service.ts`); `BookingsService.updateStatus` releases the deposit on a clean return and enforces owner-only `completed` (`src/bookings/bookings.service.ts`).

This feature does not depend on item 4 to function — photos are useful on their own — and item 4 does not depend on this one. The link is one read association (Ruling 6).

## Rulings

**Ruling 1 — the client uploads the bytes elsewhere and POSTs a URL string.** This API has no file-upload path anywhere: no `multer`, no `FileInterceptor`, no S3/R2 client, no `@nestjs/serve-static`, nothing in `package.json` and nothing in `src/`. `Listing.images` is a `String[]` of URLs (data URLs in dev) with a `ponytail:` comment already naming object storage as the upgrade path. Item 5 is "make claims resolvable", not "build a media pipeline" — inventing one here would be a bigger feature than the one requested, with its own auth, size limits, virus scanning, and CDN. `HandoffPhoto.url` is a string; who puts bytes behind it is the client's problem, exactly as it already is for listing images.

**Ruling 2 — one row per photo, not one row per photo-event.** A handoff produces "however many photos it took to show the condition" — four angles of a lens, one of a bike frame. A row per photo with `stage` + `uploaderId` on it makes that a plain `findMany`; a row per event holding a `String[]` would make appending a photo a read-modify-write and would give every photo the *event's* timestamp instead of its own. The whole feature is "timestamped photos"; a per-photo `createdAt` is the feature.

**Ruling 3 — all four photo-events are optional. Nothing is required, nothing is blocked.** The four combinations (pickup/return × renter/owner) are what the model *permits*, not what it *demands*. Making pickup photos a precondition on `confirmed`, or return photos a precondition on `completed`, would block a real handover on a phone with no signal in a car park, and would break every booking currently mid-flight. A dispute filed with no photos is exactly as resolvable as it is today — worse evidence, not a blocked path. The gate ("no photos, no claim") is listed under Out of scope with its trigger condition.

**Ruling 4 — `createdAt` is `@default(now())` and is never accepted from the client.** A timestamp the photographer picks is not evidence. This is the one non-negotiable line in the feature, and it is free: the same `@default(now())` every other model here already uses. No `takenAt` field, no EXIF parsing, no client-supplied time at all. The known ceiling, stated plainly: this timestamps *when the URL was submitted to this API*, not when the shutter fired, and nothing here proves the photo depicts this booking's gear. That is enough to kill "he-said-she-said about the order of events" and honest about the rest.

**Ruling 5 — the uploader's role (renter vs owner) is derived, never stored.** `uploaderId` plus the booking is enough: `uploaderId === booking.renterId` → renter, else owner. This is the `Message` precedent verbatim ("whether the sender was acting as renter or owner is derived by comparing senderId to thread.renterId — not stored, since it's fully computable and storing it risks drift"). `Review.direction` is stored, but only because it buys a `@@unique([bookingId, direction])` constraint; there is no uniqueness rule here (Ruling 2 says many rows per event), so the column would buy nothing and could drift.

**Ruling 6 — the tie to disputes is read-only, in two places, and touches no write path.** Parties read evidence through `GET /bookings/:bookingId/handoff-photos`. Admins resolving a claim read it through the existing `DisputesService.findByIdForAdmin`, which gains `handoffPhotos: true` in its booking include — one line. `DisputesService.create` and `updateStatus` are not modified: filing a claim does not require photos, resolving one does not consume them programmatically, and no money decision reads this table. Evidence informs a human; it does not drive a state machine.

**Ruling 7 — photos are immutable: no PATCH, no DELETE.** Evidence that a party can edit or withdraw after seeing the claim against them is not evidence. There is no update endpoint and no delete endpoint, not even a soft one. A wrong photo is corrected by uploading the right one next to it — both timestamped, which is itself informative. `Review` set this precedent ("immutable once submitted").

**Ruling 8 — a per-party, per-stage cap of 20 photos.** `POST` is an authenticated, unbounded row-creating endpoint on a table nobody prunes; 20 is comfortably above what an honest handover needs and stops a party from writing ten thousand rows against a booking they are in a fight over. One `count` query on a path that is already doing two.

## Data model

```prisma
enum HandoffStage {
  pickup
  returned
}

model HandoffPhoto {
  id    String       @id @default(uuid())
  stage HandoffStage
  // A URL the client uploaded somewhere else — this API stores no bytes and
  // has no upload path (Ruling 1). Same shape as Listing.images, same
  // upgrade path: object storage when the mock/dev scale stops holding.
  url   String
  note  String?      @db.Text

  // Server-set, never client-supplied (Ruling 4). A timestamp the
  // photographer chooses is not evidence.
  createdAt DateTime @default(now())

  bookingId String
  booking   Booking @relation(fields: [bookingId], references: [id])

  // Renter-or-owner is derived by comparing this to booking.renterId
  // (Ruling 5) — the same reasoning Message uses for senderId.
  uploaderId String
  uploader   User   @relation(fields: [uploaderId], references: [id])

  @@index([bookingId, createdAt])
  @@map("handoff_photos")
}
```

`Booking` gains `handoffPhotos HandoffPhoto[]`; `User` gains `handoffPhotos HandoffPhoto[]`. Neither relation needs a name — there is exactly one relation from `HandoffPhoto` to each, unlike `Review`'s two relations to `User`.

**Why `returned` and not `return`:** `return` is a JS/TS keyword, and the generated Prisma client surfaces enum values as bare property names. One word of elegance is not worth a client-generation gamble in a plan meant to be executed unattended.

### Who may add what, when

`BookingStatus` is `pending | confirmed | completed | cancelled` (verified in the schema — there is no `picked_up`/`returned` lifecycle state; that is Tier 3, item 12).

| Booking status | `pickup` photos | `returned` photos |
| --- | --- | --- |
| `pending` | rejected | rejected |
| `confirmed` | allowed | allowed |
| `completed` | rejected | allowed |
| `cancelled` | rejected | rejected |

Both parties may add photos at either stage they are permitted; neither can add on the other's behalf, because `uploaderId` is the JWT subject and is never read from the body.

`returned` stays open on a `completed` booking because the owner is the one who marks a booking completed (item 4, Ruling 6) and typically does so the moment the gear is back — a renter who photographs the drop-off and uploads it ten minutes later must not be locked out by the counterparty's click. Nothing narrows that window afterwards; that is a deliberate ceiling, marked with a `ponytail:` comment and an upgrade path (an N-hour window after `completed`, or a real `returned` lifecycle state from item 12).

## API

New `HandoffPhotosModule` (`src/handoff-photos/`), mirroring `ReviewsModule` — bare `@Controller()` with fully-qualified nested routes, `imports: [AuthModule]`, registered in `src/app.module.ts`.

- `POST /bookings/:bookingId/handoff-photos` — auth required, caller must be a party. Body: `{ stage: 'pickup' | 'returned', url: string, note?: string }`. Returns the created row. `uploaderId` and `createdAt` are server-set and are not accepted from the body.
- `GET /bookings/:bookingId/handoff-photos` — auth required, caller must be a party. Returns **both** parties' photos for the booking, oldest first, each with a derived `role: 'renter' | 'owner'`. Both sides see everything: a renter who cannot see the photos being used to claim against their deposit cannot answer them.

No admin controller is added. `GET /admin/disputes/:id` already exists and already returns the booking; it gains the photos through its include (Ruling 6).

## Validation rules (service layer)

Same shape as `ReviewsService.create` / `DisputesService.create` — one `booking.findUnique({ include: { listing: true } })`, then guards in order:

1. Booking must exist → else `NotFoundException('Booking not found')`.
2. Caller must be `booking.renterId` or `booking.listing.ownerId` → else `ForbiddenException('You are not a party to this booking')`. Verbatim the string both existing services use.
3. `stage === 'pickup'` requires `booking.status === 'confirmed'` → else `ConflictException('Pickup photos can only be added while the booking is confirmed')`.
4. `stage === 'returned'` requires `booking.status` to be `'confirmed'` or `'completed'` → else `ConflictException('Return photos can only be added once the booking is confirmed')`.
5. At most 20 rows per `(bookingId, uploaderId, stage)` → else `ConflictException('Photo limit reached for this handoff')` (Ruling 8).
6. DTO: `stage` `@IsIn(['pickup', 'returned'])`; `url` `@IsString() @IsNotEmpty() @MaxLength(2048)`; `note` `@IsOptional() @IsString() @MaxLength(500)`.

`@IsUrl` is deliberately **not** used on `url`: the repo's existing image convention (`Listing.images`) is data URLs in dev, which `@IsUrl` rejects. `@MaxLength(2048)` is the guard that actually matters — it keeps a multi-megabyte inline blob out of a Postgres text column while leaving any real URL comfortable.

`findForBooking` re-runs guards 1 and 2 and nothing else.

## Files

- `prisma/schema.prisma` — `HandoffStage` enum, `HandoffPhoto` model, one back-relation each on `Booking` and `User`. One migration.
- `src/handoff-photos/handoff-photos.module.ts`
- `src/handoff-photos/handoff-photos.controller.ts`
- `src/handoff-photos/handoff-photos.service.ts`
- `src/handoff-photos/dto/create-handoff-photo.dto.ts`
- `src/handoff-photos/handoff-photos.service.spec.ts`
- `src/app.module.ts` — register `HandoffPhotosModule`.
- Modify: `src/disputes/disputes.service.ts` — `handoffPhotos: true` in `findByIdForAdmin`'s booking include (Ruling 6). One line.
- Modify: `src/disputes/disputes.service.spec.ts` — one test asserting the include.
- `src/bookings/`, `src/payments/`, `src/notifications/`, and every DTO in them are **not** modified.
- `package.json` is **not** modified. No new dependency.

## Out of scope

- **Any file upload, storage, CDN, resizing, or EXIF handling** (Ruling 1). The client uploads elsewhere and sends a URL.
- **Photos as a precondition on any transition** (Ruling 3). `confirmed` and `completed` behave exactly as they do today. Revisit when the "owner claims against a renter who has pickup photos proving prior damage" case actually shows up and the product wants to force the habit.
- **Editing or deleting a photo** (Ruling 7), including admin-side removal. A takedown request is a database task until it isn't.
- **Narrowing the return-photo window after `completed`.** Marked with a `ponytail:` comment; the upgrade is an N-hour cutoff or item 12's real `picked_up`/`returned` lifecycle states.
- **Notifications.** No `NotificationType` value is added and nobody is told a photo appeared. Photos are added *during* a handover both parties are physically at; a push about it is noise. Add one if photos ever start arriving days late.
- **Attaching a photo to a `Dispute` directly**, or a per-claim evidence subset. Photos hang off the booking, and a dispute is `@@unique` per booking, so the association is already exact.
- **Verifying a photo depicts this booking's gear** — image hashing, geotag checks, liveness. Ruling 4 states the ceiling honestly rather than pretending to close it.
- **Public or listing-page exposure.** Handoff photos are visible to the two parties and to admins. They are not listing marketing and are not on any unauthenticated route.
