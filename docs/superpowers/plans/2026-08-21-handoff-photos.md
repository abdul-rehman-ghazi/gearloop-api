# Handoff Condition Photos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give a booking a timestamped photographic record of both handovers, from both parties, so a damage claim against a deposit is resolvable with evidence instead of adjectives.

**Architecture:** One new `HandoffPhoto` row per photo, carrying a client-supplied **URL string** (this API has no upload path and gains none), a `stage`, an `uploaderId`, and a server-set `createdAt`. One new module, `src/handoff-photos/`, shaped exactly like the existing `ReviewsModule`: bare `@Controller()`, fully-qualified nested routes under `/bookings/:bookingId`, `imports: [AuthModule]`, `PrismaService` as the only injected dependency. The only edit outside that directory is one line in `DisputesService.findByIdForAdmin` and one line in `app.module.ts`.

**Tech Stack:** NestJS 11, Prisma 7 (`prisma-client` generator, output `generated/prisma`), PostgreSQL, Jest 30 + ts-jest with hand-rolled mocks (`makePrisma()` returning `{...} as unknown as PrismaService`; no `Test.createTestingModule` anywhere in this repo).

**Spec:** `docs/superpowers/specs/2026-08-21-handoff-photos-design.md`

**Dependency status (verified, not assumed):** item 4 (security deposits) is **merged** — `Booking.depositStatus`/`depositIntentId`/`depositAmount` and `Dispute.claimAmount`/`resolvedAmount` are in `prisma/schema.prisma`, and `DisputesService` injects `PaymentsService`. Item 1 (reviews) is **also merged** — `src/reviews/` exists in full and is the structural template this plan copies. Nothing here needs to stub or build either.

## Global Constraints

- **Ruling 1 — no upload infrastructure, of any kind.** Do not add `multer`, `FileInterceptor`, `@UseInterceptors`, an S3/R2/GCS client, `@nestjs/serve-static`, a signed-URL endpoint, or any dependency to `package.json`. `url` is a `String` column and the client is responsible for the bytes, exactly as `Listing.images` already works.
- **Ruling 4 — `createdAt` is `@default(now())` and is never in a DTO.** No `takenAt`, no client timestamp, no EXIF. If a diff makes a time value reachable from the request body, it is wrong.
- **Ruling 5 — `uploaderId` comes from `@CurrentUser()`, never from the body.** No `uploaderId`, `role`, `party`, `renterId`, or `ownerId` field on `CreateHandoffPhotoDto`. Role is derived at read time.
- **Ruling 3 — no write path outside this module changes.** `BookingsService.create`, `BookingsService.updateStatus`, `DisputesService.create`, and `DisputesService.updateStatus` are not touched. Photos gate nothing, block nothing, and release no money. The one permitted edit in `src/disputes/` is `handoffPhotos: true` inside `findByIdForAdmin`'s existing include.
- **Ruling 7 — immutable.** No `@Patch`, no `@Delete`, no `deletedAt`, no `update` call against `handoffPhoto` anywhere.
- **Enum values are `pickup` and `returned`.** Not `return` — it is a JS/TS keyword and the generated client exposes enum values as bare property names.
- Exact user-facing messages, verbatim: `'Booking not found'`, `'You are not a party to this booking'`, `'Pickup photos can only be added while the booking is confirmed'`, `'Return photos can only be added once the booking is confirmed'`, `'Photo limit reached for this handoff'`. The first two are copied from `ReviewsService`/`DisputesService` on purpose — one vocabulary across the API.
- **Out of scope, do not build:** photo upload/storage, photos as a precondition on `confirmed`/`completed`, edit or delete endpoints, notifications or a new `NotificationType` value, a return-window cutoff, image verification, public/listing exposure, an admin photo controller.
- Existing tests must keep passing, with **zero** edits to any existing test file except the one new `describe` appended in Task 4. No assertion in an existing test changes.
- `src/bookings/`, `src/payments/`, `src/notifications/`, and `package.json` are **not** modified.

## File Structure

| File | Responsibility |
| --- | --- |
| `prisma/schema.prisma` (modify) | `HandoffStage` enum, `HandoffPhoto` model, 1 back-relation on `Booking`, 1 on `User` |
| `prisma/migrations/<ts>_add_handoff_photos/` (create, generated) | The migration |
| `src/handoff-photos/dto/create-handoff-photo.dto.ts` (create) | `stage`, `url`, `note?` — and nothing else |
| `src/handoff-photos/handoff-photos.service.ts` (create) | `create`, `findForBooking`, private `assertParty` |
| `src/handoff-photos/handoff-photos.controller.ts` (create) | `POST`/`GET /bookings/:bookingId/handoff-photos` |
| `src/handoff-photos/handoff-photos.module.ts` (create) | `imports: [AuthModule]` |
| `src/handoff-photos/handoff-photos.service.spec.ts` (create) | Unit tests for both service methods |
| `src/app.module.ts` (modify) | Register `HandoffPhotosModule` |
| `src/disputes/disputes.service.ts` (modify) | `handoffPhotos: true` in `findByIdForAdmin` |
| `src/disputes/disputes.service.spec.ts` (modify) | One appended test for that include |

**Scope check:** single subsystem (an evidence record hanging off a booking). One plan, no sub-plans.

**Task count and boundaries (4 tasks):** (1) schema — pure additive data model, no behaviour, reviewable on its own; (2) the write path — the guards that decide who may put evidence on a booking and when, which is the entire trust surface of this feature; (3) the read path plus HTTP wiring — the "can the renter see the photos being used against them" question, a separate judgment call from who may write; (4) the dispute association — one line in another module, isolated so a reviewer can reject the coupling without rejecting the feature.

---

### Task 1: Handoff photo schema

**Files:**
- Modify: `prisma/schema.prisma` (enums block; `HandoffPhoto` model; `Booking` and `User` relations)
- Create (generated): `prisma/migrations/<timestamp>_add_handoff_photos/migration.sql`

**Interfaces:**
- Consumes: nothing.
- Produces: `HandoffStage` type; `prisma.handoffPhoto` delegate with `create`/`findMany`/`count`; `Booking.handoffPhotos` and `User.handoffPhotos` relations includable from any existing query.

- [ ] **Step 1: Add the `HandoffStage` enum**

In `prisma/schema.prisma`, in the enums block, immediately after `enum DepositStatus { ... }`, add:

```prisma
enum HandoffStage {
  pickup
  // `returned`, not `return` — `return` is a JS/TS keyword and the generated
  // client exposes enum values as bare property names.
  returned
}
```

- [ ] **Step 2: Add the `HandoffPhoto` model**

In `prisma/schema.prisma`, immediately after `model Review { ... }` and before `model Notification`, add:

```prisma
model HandoffPhoto {
  id    String       @id @default(uuid())
  stage HandoffStage
  // A URL the client uploaded somewhere else. This API stores no bytes and
  // has no upload path — same convention as Listing.images, same upgrade
  // path (object storage) when mock/dev scale stops holding.
  url   String
  note  String?      @db.Text

  // Server-set, never client-supplied. A timestamp the photographer chooses
  // is not evidence, and "timestamped" is the entire point of this table.
  createdAt DateTime @default(now())

  bookingId String
  booking   Booking @relation(fields: [bookingId], references: [id])

  // Renter-or-owner is derived by comparing this to booking.renterId, the
  // same way Message derives it from senderId — storing it would buy
  // nothing here (no unique constraint depends on it) and could drift.
  uploaderId String
  uploader   User   @relation(fields: [uploaderId], references: [id])

  @@index([bookingId, createdAt])
  @@map("handoff_photos")
}
```

- [ ] **Step 3: Add the two back-relations**

In `model Booking`, immediately after the `reviews Review[]` line, add:

```prisma
  handoffPhotos HandoffPhoto[]
```

In `model User`, immediately after the `notifications Notification[]` line, add:

```prisma
  handoffPhotos HandoffPhoto[]
```

Neither needs a named relation — there is exactly one relation from `HandoffPhoto` to each model, unlike `Review`'s two relations to `User`.

- [ ] **Step 4: Run the migration**

Run: `npx prisma migrate dev --name add_handoff_photos`
Expected: a new `prisma/migrations/<timestamp>_add_handoff_photos/migration.sql` containing `CREATE TYPE "HandoffStage"`, `CREATE TABLE "handoff_photos"`, the two foreign keys, and `CREATE INDEX` on `("bookingId", "createdAt")`; then "Your database is now in sync with your schema" and a client regeneration into `generated/prisma`.

This is a pure addition — a new table and a new type. No existing table is altered, so no backfill and no risk to existing rows.

- [ ] **Step 5: Verify the generated client**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: exit code 0.

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(handoff-photos): add the handoff photo table"
```

---

### Task 2: Recording a handoff photo

**Files:**
- Create: `src/handoff-photos/dto/create-handoff-photo.dto.ts`
- Create: `src/handoff-photos/handoff-photos.service.ts`
- Test: `src/handoff-photos/handoff-photos.service.spec.ts` (new file)

**Interfaces:**
- Consumes: `prisma.handoffPhoto` and `HandoffStage` from Task 1.
- Produces: `HandoffPhotosService.create(userId, bookingId, dto)`, which Task 3 exposes over HTTP.

- [ ] **Step 1: Write the DTO**

Create `src/handoff-photos/dto/create-handoff-photo.dto.ts`:

```ts
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import type { HandoffStage } from '../../../generated/prisma/enums';

export class CreateHandoffPhotoDto {
  @IsIn(['pickup', 'returned'])
  stage: HandoffStage;

  // A URL to bytes the client stored elsewhere — this API has no upload
  // path. Deliberately NOT @IsUrl: the repo's existing image convention
  // (Listing.images) is data URLs in dev, which @IsUrl rejects. MaxLength is
  // the guard that matters — it keeps a multi-megabyte inline blob out of a
  // text column while leaving any real URL comfortable.
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  // `uploaderId` and `createdAt` are deliberately absent — both are set
  // server-side, and a client-chosen timestamp is not evidence.
}
```

The `import type { HandoffStage } from '../../../generated/prisma/enums'` path mirrors `src/reviews/reviews.service.ts`'s `import type { ReviewDirection } from '../../generated/prisma/enums'`, one level deeper because this file is in `dto/`.

- [ ] **Step 2: Write the failing create tests**

Create `src/handoff-photos/handoff-photos.service.spec.ts`:

```ts
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { HandoffPhotosService } from './handoff-photos.service';
import { PrismaService } from '../prisma/prisma.service';

function makePrisma() {
  return {
    booking: {
      findUnique: jest.fn(),
    },
    handoffPhoto: {
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn().mockResolvedValue(0),
    },
  } as unknown as PrismaService;
}

const confirmedBooking = {
  id: 'b1',
  status: 'confirmed',
  renterId: 'renter-1',
  listingId: 'l1',
  listing: { id: 'l1', ownerId: 'owner-1' },
};

describe('HandoffPhotosService.create', () => {
  function arrange(bookingOverrides: Record<string, unknown> = {}) {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
      ...confirmedBooking,
      ...bookingOverrides,
    });
    (prisma.handoffPhoto.create as jest.Mock).mockResolvedValue({ id: 'p1' });
    return prisma;
  }

  it('records a pickup photo for the renter on a confirmed booking', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    const result = await service.create('renter-1', 'b1', {
      stage: 'pickup',
      url: 'https://cdn.example.com/a.jpg',
      note: 'Small scuff on the barrel',
    });

    expect(prisma.handoffPhoto.create).toHaveBeenCalledWith({
      data: {
        bookingId: 'b1',
        uploaderId: 'renter-1',
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
        note: 'Small scuff on the barrel',
      },
    });
    expect(result).toEqual({ id: 'p1' });
  });

  it('records a pickup photo for the owner too', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    await service.create('owner-1', 'b1', {
      stage: 'pickup',
      url: 'https://cdn.example.com/b.jpg',
    });

    expect(prisma.handoffPhoto.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ uploaderId: 'owner-1' }),
    });
  });

  it('never writes a client-supplied timestamp or uploader', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    await service.create('renter-1', 'b1', {
      stage: 'pickup',
      url: 'https://cdn.example.com/a.jpg',
      // Anything extra a client smuggles in must not reach the row.
      ...({ createdAt: '2020-01-01T00:00:00Z', uploaderId: 'owner-1' } as object),
    });

    const { data } = (prisma.handoffPhoto.create as jest.Mock).mock.calls[0][0];
    expect(data.createdAt).toBeUndefined();
    expect(data.uploaderId).toBe('renter-1');
  });

  it('rejects a photo from someone who is not a party to the booking', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('stranger-1', 'b1', {
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
      }),
    ).rejects.toThrow('You are not a party to this booking');

    expect(prisma.handoffPhoto.create).not.toHaveBeenCalled();
  });

  it('rejects a photo on a booking that does not exist', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('renter-1', 'nope', {
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects pickup photos on a pending booking', async () => {
    const prisma = arrange({ status: 'pending' });

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('renter-1', 'b1', {
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
      }),
    ).rejects.toThrow(
      'Pickup photos can only be added while the booking is confirmed',
    );
  });

  it('rejects pickup photos once the booking is completed', async () => {
    const prisma = arrange({ status: 'completed' });

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('owner-1', 'b1', {
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('accepts return photos on a confirmed booking', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    await service.create('owner-1', 'b1', {
      stage: 'returned',
      url: 'https://cdn.example.com/c.jpg',
    });

    expect(prisma.handoffPhoto.create).toHaveBeenCalled();
  });

  it('still accepts return photos just after the owner completes the booking', async () => {
    const prisma = arrange({ status: 'completed' });

    const service = new HandoffPhotosService(prisma);
    await service.create('renter-1', 'b1', {
      stage: 'returned',
      url: 'https://cdn.example.com/d.jpg',
    });

    expect(prisma.handoffPhoto.create).toHaveBeenCalled();
  });

  it('rejects return photos on a cancelled booking', async () => {
    const prisma = arrange({ status: 'cancelled' });

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('renter-1', 'b1', {
        stage: 'returned',
        url: 'https://cdn.example.com/d.jpg',
      }),
    ).rejects.toThrow(
      'Return photos can only be added once the booking is confirmed',
    );
  });

  it('caps a party at 20 photos per stage', async () => {
    const prisma = arrange();
    (prisma.handoffPhoto.count as jest.Mock).mockResolvedValue(20);

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.create('renter-1', 'b1', {
        stage: 'pickup',
        url: 'https://cdn.example.com/a.jpg',
      }),
    ).rejects.toThrow('Photo limit reached for this handoff');

    expect(prisma.handoffPhoto.count).toHaveBeenCalledWith({
      where: { bookingId: 'b1', uploaderId: 'renter-1', stage: 'pickup' },
    });
    expect(prisma.handoffPhoto.create).not.toHaveBeenCalled();
  });

  it('counts each party and stage separately against the cap', async () => {
    const prisma = arrange();
    (prisma.handoffPhoto.count as jest.Mock).mockResolvedValue(19);

    const service = new HandoffPhotosService(prisma);
    await service.create('renter-1', 'b1', {
      stage: 'pickup',
      url: 'https://cdn.example.com/a.jpg',
    });

    expect(prisma.handoffPhoto.create).toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- src/handoff-photos/handoff-photos.service.spec.ts`
Expected: FAIL — `Cannot find module './handoff-photos.service'`.

- [ ] **Step 4: Implement the service create path**

Create `src/handoff-photos/handoff-photos.service.ts`:

```ts
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHandoffPhotoDto } from './dto/create-handoff-photo.dto';

// Enough for an honest four-angle walkaround with room to spare; low enough
// that a party in a fight can't write ten thousand rows against a booking.
const PHOTO_LIMIT = 20;

@Injectable()
export class HandoffPhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, bookingId: string, dto: CreateHandoffPhotoDto) {
    const booking = await this.assertParty(bookingId, userId);

    // There is no picked_up/returned booking state in this schema (that's
    // Tier 3, item 12), so `confirmed` is the whole rental window and both
    // handovers sit at its ends. A pending or cancelled booking has no
    // handover at all.
    if (dto.stage === 'pickup' && booking.status !== 'confirmed') {
      throw new ConflictException(
        'Pickup photos can only be added while the booking is confirmed',
      );
    }

    // Return photos stay open on a completed booking: the owner is the one
    // who marks it completed, usually the moment the gear is back, and a
    // renter who photographs the drop-off must not be locked out by the
    // counterparty's click.
    //
    // ponytail: that window never closes — a party can add "return" photos
    // to a booking completed six months ago. Upgrade path when it matters:
    // an N-hour cutoff after the completion timestamp, or item 12's real
    // returned lifecycle state, which gives an actual event to measure from.
    if (
      dto.stage === 'returned' &&
      booking.status !== 'confirmed' &&
      booking.status !== 'completed'
    ) {
      throw new ConflictException(
        'Return photos can only be added once the booking is confirmed',
      );
    }

    const count = await this.prisma.handoffPhoto.count({
      where: { bookingId, uploaderId: userId, stage: dto.stage },
    });
    if (count >= PHOTO_LIMIT) {
      throw new ConflictException('Photo limit reached for this handoff');
    }

    // uploaderId is the JWT subject, never the body; createdAt is the
    // column default. Both are what make the row evidence rather than a
    // claim about a row.
    return this.prisma.handoffPhoto.create({
      data: {
        bookingId,
        uploaderId: userId,
        stage: dto.stage,
        url: dto.url,
        note: dto.note,
      },
    });
  }

  private async assertParty(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.renterId !== userId && booking.listing.ownerId !== userId) {
      throw new ForbiddenException('You are not a party to this booking');
    }
    return booking;
  }
}
```

`assertParty` is the exact guard pair `ReviewsService.create` and `ReviewsService.findForBooking` each spell out inline; pulling it into one private method here is because this service needs it twice too, not a speculative abstraction.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- src/handoff-photos/handoff-photos.service.spec.ts`
Expected: PASS — 12 tests.

- [ ] **Step 6: Verify types and lint**

Run: `npx tsc --noEmit -p tsconfig.json && npm run lint`
Expected: exit code 0, eslint clean.

- [ ] **Step 7: Commit**

```bash
git add src/handoff-photos
git commit -m "feat(handoff-photos): record timestamped pickup and return photos"
```

---

### Task 3: Reading a booking's photos, and the HTTP surface

**Files:**
- Modify: `src/handoff-photos/handoff-photos.service.ts` (`findForBooking`)
- Create: `src/handoff-photos/handoff-photos.controller.ts`
- Create: `src/handoff-photos/handoff-photos.module.ts`
- Modify: `src/app.module.ts`
- Test: `src/handoff-photos/handoff-photos.service.spec.ts` (appended `describe`)

**Interfaces:**
- Consumes: `assertParty` and the rows written in Task 2.
- Produces: `GET`/`POST /bookings/:bookingId/handoff-photos` as live routes.

- [ ] **Step 1: Append the failing read tests**

Append to `src/handoff-photos/handoff-photos.service.spec.ts`:

```ts
describe('HandoffPhotosService.findForBooking', () => {
  const rows = [
    {
      id: 'p1',
      stage: 'pickup',
      url: 'https://cdn.example.com/a.jpg',
      uploaderId: 'renter-1',
      createdAt: new Date('2026-09-01T09:00:00Z'),
    },
    {
      id: 'p2',
      stage: 'returned',
      url: 'https://cdn.example.com/b.jpg',
      uploaderId: 'owner-1',
      createdAt: new Date('2026-09-03T17:00:00Z'),
    },
  ];

  function arrange() {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      confirmedBooking,
    );
    (prisma.handoffPhoto.findMany as jest.Mock).mockResolvedValue(rows);
    return prisma;
  }

  it('returns both parties photos oldest first', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    const result = await service.findForBooking('b1', 'renter-1');

    expect(prisma.handoffPhoto.findMany).toHaveBeenCalledWith({
      where: { bookingId: 'b1' },
      orderBy: { createdAt: 'asc' },
    });
    expect(result).toHaveLength(2);
  });

  it('derives the uploader role rather than reading a stored column', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    const result = await service.findForBooking('b1', 'owner-1');

    expect(result[0].role).toBe('renter');
    expect(result[1].role).toBe('owner');
  });

  it('shows the renter the owner photos too', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    const result = await service.findForBooking('b1', 'renter-1');

    // A renter who cannot see the photos being used to claim against their
    // deposit cannot answer them.
    expect(result.map((p) => p.uploaderId)).toEqual(['renter-1', 'owner-1']);
  });

  it('refuses a non-party', async () => {
    const prisma = arrange();

    const service = new HandoffPhotosService(prisma);
    await expect(
      service.findForBooking('b1', 'stranger-1'),
    ).rejects.toThrow(ForbiddenException);

    expect(prisma.handoffPhoto.findMany).not.toHaveBeenCalled();
  });

  it('refuses a booking that does not exist', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new HandoffPhotosService(prisma);
    await expect(service.findForBooking('nope', 'renter-1')).rejects.toThrow(
      'Booking not found',
    );
  });

  it('reads photos on a completed booking, so a dispute can use them', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
      ...confirmedBooking,
      status: 'completed',
    });
    (prisma.handoffPhoto.findMany as jest.Mock).mockResolvedValue(rows);

    const service = new HandoffPhotosService(prisma);
    const result = await service.findForBooking('b1', 'owner-1');

    expect(result).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/handoff-photos/handoff-photos.service.spec.ts -t "findForBooking"`
Expected: FAIL — `service.findForBooking is not a function`.

- [ ] **Step 3: Implement `findForBooking`**

In `src/handoff-photos/handoff-photos.service.ts`, add after `create` and before `assertParty`:

```ts
  async findForBooking(bookingId: string, userId: string) {
    const booking = await this.assertParty(bookingId, userId);

    const photos = await this.prisma.handoffPhoto.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
    });

    // Both parties see everything: a renter who can't see the photos being
    // used to claim against their deposit can't answer them. `role` is
    // derived here, the same way Message derives sender-side from senderId.
    return photos.map((photo) => ({
      ...photo,
      role: photo.uploaderId === booking.renterId ? 'renter' : 'owner',
    }));
  }
```

- [ ] **Step 4: Write the controller**

Create `src/handoff-photos/handoff-photos.controller.ts`:

```ts
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { HandoffPhotosService } from './handoff-photos.service';
import { CreateHandoffPhotoDto } from './dto/create-handoff-photo.dto';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

// Both routes are party-only, so the guard sits on the class rather than
// per-method (ReviewsController splits them only because two of its routes
// are public; none of these are).
@UseGuards(JwtUserAuthGuard)
@Controller('bookings/:bookingId/handoff-photos')
export class HandoffPhotosController {
  constructor(private readonly handoffPhotosService: HandoffPhotosService) {}

  @Post()
  create(
    @CurrentUser() user: UserAuthContext,
    @Param('bookingId') bookingId: string,
    @Body() dto: CreateHandoffPhotoDto,
  ) {
    return this.handoffPhotosService.create(user.userId, bookingId, dto);
  }

  @Get()
  findForBooking(
    @CurrentUser() user: UserAuthContext,
    @Param('bookingId') bookingId: string,
  ) {
    return this.handoffPhotosService.findForBooking(bookingId, user.userId);
  }
}
```

There is deliberately no `@Patch` and no `@Delete` — evidence a party can edit after seeing the claim against them is not evidence.

- [ ] **Step 5: Write the module and register it**

Create `src/handoff-photos/handoff-photos.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HandoffPhotosController } from './handoff-photos.controller';
import { HandoffPhotosService } from './handoff-photos.service';

@Module({
  imports: [AuthModule],
  controllers: [HandoffPhotosController],
  providers: [HandoffPhotosService],
})
export class HandoffPhotosModule {}
```

In `src/app.module.ts`, add the import alongside the others and `HandoffPhotosModule` to the `imports` array, immediately after `ReviewsModule`:

```ts
import { HandoffPhotosModule } from './handoff-photos/handoff-photos.module';
```

`PrismaModule` is already global-registered at the app level, exactly as `ReviewsModule` relies on.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- src/handoff-photos/handoff-photos.service.spec.ts`
Expected: PASS — 18 tests.

- [ ] **Step 7: Verify DI and the routes resolve at runtime**

Run: `npm run start` and wait for the startup log, then Ctrl-C.
Expected: Nest logs `HandoffPhotosModule dependencies initialized` and maps `{/bookings/:bookingId/handoff-photos, POST}` and `{/bookings/:bookingId/handoff-photos, GET}`, with no `Nest can't resolve dependencies of the HandoffPhotosService` error and no route conflict warning against the existing `/bookings/:id` routes.

- [ ] **Step 8: Run the whole suite, types, and lint**

Run: `npm test && npx tsc --noEmit -p tsconfig.json && npm run lint`
Expected: all suites PASS, tsc exit code 0, eslint clean. No existing test file was touched.

- [ ] **Step 9: Commit**

```bash
git add src/handoff-photos src/app.module.ts
git commit -m "feat(handoff-photos): expose a booking's handoff photos to both parties"
```

---

### Task 4: Put the photos in front of the admin resolving a claim

**Files:**
- Modify: `src/disputes/disputes.service.ts` (`findByIdForAdmin` include)
- Test: `src/disputes/disputes.service.spec.ts` (appended `describe`)

**Interfaces:**
- Consumes: `Booking.handoffPhotos` from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Append the failing test**

Append to `src/disputes/disputes.service.spec.ts`:

```ts
describe('DisputesService.findByIdForAdmin handoff evidence', () => {
  it('includes the booking handoff photos', async () => {
    const prisma = makePrisma();
    (prisma.dispute.findUnique as jest.Mock).mockResolvedValue({
      id: 'd1',
      status: 'flagged',
      claimAmount: new Prisma.Decimal('80.00'),
      booking: {
        id: 'b1',
        renter: { id: 'renter-1', passwordHash: 'x' },
        listing: { id: 'l1', owner: { id: 'owner-1', passwordHash: 'y' } },
        handoffPhotos: [{ id: 'p1', stage: 'pickup' }],
      },
    });

    const service = new DisputesService(
      prisma,
      makeNotifications(),
      makePayments(),
    );
    const result = await service.findByIdForAdmin('d1');

    // The include is what matters: an admin setting resolvedAmount needs the
    // evidence on the same screen as the number.
    const { include } = (prisma.dispute.findUnique as jest.Mock).mock
      .calls[0][0];
    expect(include.booking.include.handoffPhotos).toBe(true);
    expect(result.booking.handoffPhotos).toEqual([
      { id: 'p1', stage: 'pickup' },
    ]);
  });
});
```

This reuses the `makePrisma` / `makeNotifications` / `makePayments` helpers already at the top of that spec file. No existing test in it changes.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/disputes/disputes.service.spec.ts -t "handoff evidence"`
Expected: FAIL — `expect(include.booking.include.handoffPhotos).toBe(true) / Received: undefined`.

- [ ] **Step 3: Add the include**

In `src/disputes/disputes.service.ts`, in `findByIdForAdmin`, change:

```ts
      include: {
        booking: {
          include: { renter: true, listing: { include: { owner: true } } },
        },
      },
```

to:

```ts
      include: {
        booking: {
          include: {
            renter: true,
            listing: { include: { owner: true } },
            // Read-only evidence for the admin setting resolvedAmount. This
            // is the only coupling between handoff photos and disputes — no
            // write path reads this table and no claim requires a photo.
            handoffPhotos: true,
          },
        },
      },
```

`findAllForAdmin` is deliberately left alone — the list view does not need every photo of every disputed booking, and `sanitizeForAdmin` passes the extra relation through untouched in either case (it only strips `passwordHash` off `renter` and `owner`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/disputes/disputes.service.spec.ts`
Expected: PASS — all pre-existing dispute tests plus the 1 new one.

- [ ] **Step 5: Run the whole suite, types, and lint**

Run: `npm test && npx tsc --noEmit -p tsconfig.json && npm run lint`
Expected: all suites PASS, tsc exit code 0, eslint clean.

- [ ] **Step 6: Commit**

```bash
git add src/disputes
git commit -m "feat(handoff-photos): show handoff evidence on the admin dispute view"
```

---

## Self-Review

**Spec coverage**

| Spec section | Task |
| --- | --- |
| `HandoffStage` enum (`pickup` / `returned`) | Task 1, Step 1 |
| `HandoffPhoto` model, one row per photo (Ruling 2) | Task 1, Step 2 |
| Server-set `createdAt` (Ruling 4) | Task 1, Step 2; asserted Task 2, Step 2 |
| `Booking.handoffPhotos` / `User.handoffPhotos` | Task 1, Step 3 |
| One migration | Task 1, Step 4 |
| URL string, no upload infra (Ruling 1) | Task 2, Step 1 |
| `uploaderId` from the JWT, never the body (Ruling 5) | Task 2, Steps 1 & 4 |
| Party check → `'You are not a party to this booking'` | Task 2, Step 4 (`assertParty`) |
| Pickup allowed only on `confirmed` | Task 2, Step 4 |
| Return allowed on `confirmed` or `completed`, `ponytail:` on the open window | Task 2, Step 4 |
| 20-photo cap per party per stage (Ruling 8) | Task 2, Step 4 |
| DTO validators, no `@IsUrl` | Task 2, Step 1 |
| `GET` returns both parties, oldest first, derived `role` | Task 3, Step 3 |
| `POST`/`GET /bookings/:bookingId/handoff-photos` | Task 3, Step 4 |
| No PATCH/DELETE (Ruling 7) | Task 3, Step 4 |
| `HandoffPhotosModule` mirrors `ReviewsModule`, registered in `app.module.ts` | Task 3, Step 5 |
| Read-only dispute association (Ruling 6) | Task 4, Step 3 |
| Ruling 3 — no write path outside the module changes | No task touches `BookingsService` or `DisputesService.create`/`updateStatus` |
| Out of scope: uploads, transition preconditions, edit/delete, notifications, window cutoff, image verification, public exposure | Not implemented anywhere; restated in Global Constraints |

**Placeholder scan:** no "TBD", "TODO", "implement later", "add appropriate error handling", "similar to Task N", or test steps without test bodies. Every code step contains complete, paste-ready content.

**Type consistency:**
- `dto.stage` is typed `HandoffStage` (the generated union), so the `'pickup'` / `'returned'` comparisons in the service narrow correctly and a third enum value added later would be a compile error at the guards, not a silent pass-through.
- `@IsIn(['pickup', 'returned'])` is what actually validates the wire value; the TS type alone would let any string through at runtime, exactly as `CreateBookingDto` already handles `pickupMethod`.
- `assertParty` returns the `findUnique` result with `listing` included, so `booking.listing.ownerId` and `booking.renterId` are both typed — `findForBooking` reuses that same object for the `role` derivation rather than re-querying.
- `note` is `string | undefined` in the DTO and `String?` in the schema; Prisma accepts `undefined` as "not set", the same way `ReviewsService` passes `dto.comment` straight through.
- `handoffPhoto.count` returns `number`, compared against the `PHOTO_LIMIT` const — no Decimal anywhere in this feature. No money is touched.

**Judgment calls made where the spec was silent** (each annotated in the code above):
1. **`assertParty` is a private method rather than duplicated inline.** `ReviewsService` spells the same two guards out twice; here the second caller exists from day one in the same file, so extracting it is deduplication, not abstraction. It stays private and un-exported.
2. **`@UseGuards` sits on the controller class, not per-method,** because both routes are party-only. `ReviewsController` splits it only because two of its four routes are public.
3. **`role` is computed in the service, not the controller,** so both the shape and the derivation rule live next to the query that needs `booking.renterId`.
4. **`findAllForAdmin` does not get the include** — a list of every photo of every disputed booking is a payload nobody reads. Add it if the admin list view ever shows thumbnails.
5. **The cap is checked with a `count`, not enforced by a constraint.** Postgres cannot express "at most 20 rows per (booking, uploader, stage)" without a trigger, and a trigger for a fat-finger guard is worse than a query. The race (two concurrent POSTs both seeing 19) can produce a 21st row; that is a fully acceptable failure of a spam guard.
6. **`PHOTO_LIMIT = 20` is a plausible ceiling, not a researched one** — the kind of value a product decision should later replace, same standing as item 4's `Max(10000)` on `depositAmount`.
7. **A `note` field was included** though the spec text only asked for photos. One optional caption column is what turns "here is a photo of a lens" into "here is the scuff I am pointing at", and it costs one nullable text column. Skipped: threaded comments on a photo, which is a different feature.
