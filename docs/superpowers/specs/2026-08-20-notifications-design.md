# Notifications (email + in-app) — design

Part of [gearloop-feature-ideas.md](../../gearloop-feature-ideas.md) Tier 1, item 2. Per the doc: "An owner who doesn't log in never learns a booking request exists... Biggest silent conversion loss in the product."

Design decisions below were made autonomously (user instruction: proceed without pausing for approval, pick the recommended option). Each is logged as a ruling with its rationale so it can be revisited.

## Problem

Nothing notifies anyone of anything. `MessageThread.unreadForRenter`/`unreadForOwner` exist with no delivery mechanism. Booking status changes, new messages, and disputes all happen silently.

## Rulings

**Ruling 1 — one `notify()` call fires both channels.** A single `NotificationsService.notify(userId, type, title, body, link?)` writes the in-app `Notification` row and sends the email in the same call, using the same copy for both. Two independently-triggered channels would double the call sites for no benefit at this scale — every trigger point below wants both channels every time.

**Ruling 2 — `NotificationType` is an enum, not a free string.** Matches the codebase's existing convention (`BookingStatus`, `ListingStatus`, `DisputeStatus` are all enums). Values: `booking_requested`, `booking_confirmed`, `booking_cancelled`, `message_received`, `dispute_filed`, `dispute_resolved`.

**Ruling 3 — email uses `nodemailer` against configurable SMTP, with a console-log fallback when unconfigured.** No stdlib SMTP client exists in Node, and no email vendor has been chosen for this project yet — `nodemailer` is the standard, minimal way to send real mail once a provider is picked, and it works unmodified against SMTP for any provider (SES, Postmark, Gmail, etc.) via env vars. When `EMAIL_HOST` is unset (true in dev today, matching the project having no email vendor configured), `EmailService` logs the email to the console instead of throwing — same pattern as the existing `ponytail:` comments in `schema.prisma` marking a dev-scale simplification with its upgrade path.

**Ruling 4 — no denormalized unread counter.** `GET /notifications` returns the list ordered by `createdAt desc`; the caller derives an unread count by filtering on `read: false`. Matches the reviews feature's "live, not denormalized" precedent — no write-path counter to keep in sync.

**Ruling 5 — trigger points are the five events the doc explicitly implies, not a general event bus.** Building a generic pub/sub or event-emitter layer for five call sites is premature; each trigger is a single `notificationsService.notify(...)` call appended after the existing write in the relevant service, mirroring how `DisputesService.create` already does a `$transaction` alongside its core write. No new architecture, no message queue.

## Data model

```prisma
enum NotificationType {
  booking_requested
  booking_confirmed
  booking_cancelled
  message_received
  dispute_filed
  dispute_resolved
}

model Notification {
  id        String           @id @default(uuid())
  type      NotificationType
  title     String
  body      String           @db.Text
  link      String?          // relative frontend path, e.g. "/bookings/:id"
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())

  userId String
  user   User @relation(fields: [userId], references: [id])

  @@map("notifications")
}
```

`User` gains `notifications Notification[]`.

## Services

**`EmailService`** (`src/notifications/email.service.ts`) — one method: `send(to: string, subject: string, body: string): Promise<void>`. Reads `EMAIL_HOST`/`EMAIL_PORT`/`EMAIL_USER`/`EMAIL_PASS`/`EMAIL_FROM` via `ConfigService`. If `EMAIL_HOST` is unset, logs `[EmailService] would send to ${to}: ${subject}` via `Logger` and returns — never throws in dev.

**`NotificationsService`** (`src/notifications/notifications.service.ts`):
- `notify(userId: string, type: NotificationType, title: string, body: string, link?: string): Promise<Notification>` — creates the `Notification` row, looks up the user's email, calls `EmailService.send`. Errors from `EmailService.send` are caught and logged, never thrown — a failed email must never roll back the in-app notification or fail the caller's request (booking creation, message sending, etc. must succeed regardless of mail delivery).
- `findForUser(userId: string): Promise<Notification[]>` — `findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })`.
- `markRead(id: string, userId: string): Promise<Notification>` — verifies `notification.userId === userId` (else `ForbiddenException`), then updates `read: true`.

## API

New `NotificationsModule` (`src/notifications/`):
- `GET /notifications` — auth required. Returns the caller's notifications via `findForUser`.
- `PATCH /notifications/:id/read` — auth required. Marks one notification read via `markRead`.

## Trigger points (append-only edits to existing services)

| Event | File | After | Notify | Type | Copy |
| --- | --- | --- | --- | --- | --- |
| Booking requested | `src/bookings/bookings.service.ts`, `create()` | `prisma.booking.create` succeeds | `listing.ownerId` | `booking_requested` | "New booking request for {listing.title}" |
| Booking confirmed | `src/bookings/bookings.service.ts`, `updateStatus()` | `prisma.booking.update` succeeds, `dto.status === 'confirmed'` | `booking.renterId` | `booking_confirmed` | "Your booking for {listing.title} is confirmed" |
| Booking cancelled | `src/bookings/bookings.service.ts`, `updateStatus()` | same, `dto.status === 'cancelled'` | `booking.renterId` | `booking_cancelled` | "Your booking for {listing.title} was cancelled" |
| New message | `src/messages/messages.service.ts`, `createThread()` and `sendMessage()` | `prisma.message.create` succeeds | the recipient (owner on `createThread`; whichever side didn't send, on `sendMessage`) | `message_received` | "New message about {listing.title}" |
| Dispute filed | `src/disputes/disputes.service.ts`, `create()` | the existing `$transaction` succeeds | the booking party who did **not** file it (renter or owner, whichever `userId` passed to `create` is not) | `dispute_filed` | "A dispute was filed for booking {requestNumber}" |
| Dispute resolved | `src/disputes/disputes.service.ts`, `updateStatus()` | `dto.status === 'resolved'` branch succeeds | both `booking.renterId` and `booking.listing.ownerId` | `dispute_resolved` | "The dispute for booking {requestNumber} was resolved" |

`updateStatus()` in `bookings.service.ts` currently fetches the booking twice (once in the `confirmed` branch, once implicitly via `findById` at the top) — the notification trigger needs `listing.title` and `renterId`, so the existing `findById(id)` call at the top of `updateStatus` gets `include: { listing: true }` added (it doesn't have it today) rather than adding a third fetch.

Each of the three touched modules (`BookingsModule`, `MessagesModule`, `DisputesModule`) imports `NotificationsModule`; `NotificationsModule` exports `NotificationsService`.

## Files

- `prisma/schema.prisma` — `NotificationType` enum, `Notification` model, `User.notifications` back-relation. One migration.
- `src/notifications/email.service.ts`
- `src/notifications/notifications.service.ts`
- `src/notifications/notifications.controller.ts`
- `src/notifications/notifications.module.ts`
- `src/notifications/notifications.service.spec.ts`, `email.service.spec.ts` — unit tests, mocked Prisma/mocked nodemailer transport.
- Modify: `src/bookings/bookings.service.ts`, `src/bookings/bookings.module.ts`
- Modify: `src/messages/messages.service.ts`, `src/messages/messages.module.ts`
- Modify: `src/disputes/disputes.service.ts`, `src/disputes/disputes.module.ts`
- Modify: `src/app.module.ts` — register `NotificationsModule`
- Modify: `.env.example` — add `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` (all optional; absence triggers the console-log fallback)
- Modify: `package.json` — add `nodemailer` + `@types/nodemailer`

## Out of scope

- Notification preferences / opt-out (no UI or model field for it yet — everyone gets everything).
- Digest/batched emails — every event sends immediately.
- Push notifications (mobile) — email + in-app only, per the doc.
- Read-all-at-once endpoint — one `PATCH /notifications/:id/read` is enough for now; add a bulk endpoint if the frontend needs it.
- Retry/queue for failed email sends — `EmailService.send` failures are logged and swallowed, not retried.
