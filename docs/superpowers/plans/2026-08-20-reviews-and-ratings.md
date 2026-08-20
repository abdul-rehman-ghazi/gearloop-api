# Reviews & Ratings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a two-directional review system so a renter can rate the gear/owner and an owner can rate the renter, once each, after a completed booking.

**Architecture:** One `Review` table covers both sides, distinguished by a `ReviewDirection` enum so "one review per side per booking" is a database unique constraint rather than an app-level race. The server infers `direction` and `revieweeId` from the booking — the client never sends them. Ratings are never denormalized onto `Listing` or `User`; the public listing/user endpoints compute average and count live with `prisma.review.aggregate`. A new `ReviewsModule` mirrors `DisputesModule`'s shape (module imports `AuthModule`, controller uses `JwtUserAuthGuard` + `@CurrentUser()`, service takes `PrismaService`).

**Tech Stack:** NestJS 11, Prisma 7 (`prisma-client` generator, output `generated/prisma`, `@prisma/adapter-pg` against Postgres), `class-validator` DTOs, Jest + ts-jest unit tests (`npm test`, `rootDir: src`, `testRegex: .*\.spec\.ts$`).

**Spec:** `docs/superpowers/specs/2026-08-20-reviews-and-ratings-design.md`

## Global Constraints

- Enum name and values are exactly `ReviewDirection` with members `renter_to_owner` and `owner_to_renter`. Never rename, never abbreviate.
- `Review` model maps to table `reviews` via `@@map("reviews")` and carries `@@unique([bookingId, direction])`.
- `direction` and `revieweeId` are **always** derived server-side from the booking. They must never appear in `CreateReviewDto` or in any request body.
- Ratings are **not** denormalized. No `averageRating` / `reviewCount` column on `Listing` or `User`. Averages are computed per-request via `prisma.review.aggregate({ _avg: { rating: true }, _count: { rating: true } })`.
- Validation order in `ReviewsService.create`: (1) booking exists → `NotFoundException`; (2) `booking.status === 'completed'` → else `ConflictException`; (3) caller is `booking.renterId` or `booking.listing.ownerId` → else `ForbiddenException`; (4) no existing review for that `(bookingId, direction)` → else `ConflictException`.
- `rating` is validated in the DTO only (`@IsInt() @Min(1) @Max(5)`) — no DB check constraint. `comment` is an optional string.
- Reviews are immutable and immediately visible. No update endpoint, no delete endpoint, no reveal window. Do not add them.
- Out of scope, do not build: `User.responseTime`, review editing/deletion, double-blind visibility, denormalized rating storage.
- Prisma enums are imported from `generated/prisma/enums` (e.g. `import { ReviewDirection } from '../../generated/prisma/enums';`), matching `src/disputes/dto/update-dispute-status.dto.ts`.
- Test style matches `src/admin/admin.service.spec.ts`: plain `new ReviewsService(prisma)` with a hand-rolled `makePrisma()` jest-mock object cast `as unknown as PrismaService`. No `Test.createTestingModule`, no database, no supertest.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `prisma/schema.prisma` (modify) | `ReviewDirection` enum, `Review` model, `reviews`/`reviewsAuthored`/`reviewsReceived` back-relations on `Booking` and `User`. |
| `prisma/migrations/<ts>_add_reviews/` (generated) | The SQL migration created by `npx prisma migrate dev --name add_reviews`. |
| `src/reviews/dto/create-review.dto.ts` (create) | Request body shape + `class-validator` rules for `POST /bookings/:bookingId/reviews`. |
| `src/reviews/reviews.service.ts` (create) | All four operations: `create`, `findForBooking`, `findForListing`, `findForUser`. Owns every authorization and state check. |
| `src/reviews/reviews.service.spec.ts` (create) | Unit tests for every service branch, mocked Prisma. |
| `src/reviews/reviews.controller.ts` (create) | HTTP routing only. Prefix-less `@Controller()` because the four routes live under three different path roots (`bookings`, `listings`, `users`). Guards per-route: authed for the two booking routes, public for the two aggregate routes. |
| `src/reviews/reviews.module.ts` (create) | Wires controller + service, imports `AuthModule` (needed for `JwtUserAuthGuard`'s `jwt-user` strategy). |
| `src/app.module.ts` (modify) | Register `ReviewsModule`. |

Four tasks: schema/migration, the write path, the read path, HTTP wiring. Each ends in something independently reviewable and testable.

---

### Task 1: Prisma schema + migration

**Files:**
- Modify: `prisma/schema.prisma` (add enum after `enum CardBrand`, add model after `model Dispute`, add two relation fields inside `model User`, add one relation field inside `model Booking`)
- Create (generated): `prisma/migrations/<timestamp>_add_reviews/migration.sql`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: Prisma Client types `Review`, `ReviewDirection` (values `'renter_to_owner'`, `'owner_to_renter'`), and delegate `prisma.review` with `.create`, `.findMany`, `.findUnique({ where: { bookingId_direction: { bookingId, direction } } })`, `.aggregate`. All later tasks depend on these exact names.

- [ ] **Step 1: Add the `ReviewDirection` enum**
In `prisma/schema.prisma`, immediately after the `enum CardBrand { ... }` block (end of the `── Enums ──` section), add:
```prisma
enum ReviewDirection {
  renter_to_owner
  owner_to_renter
}
```

- [ ] **Step 2: Add the `Review` model**
In `prisma/schema.prisma`, immediately after the `model Dispute { ... }` block, add:
```prisma
model Review {
  id        String          @id @default(uuid())
  // 1-5, validated at the DTO layer (@IsInt/@Min(1)/@Max(5)) — deliberately
  // no DB check constraint, matching the design doc.
  rating    Int
  comment   String?         @db.Text
  // Stored rather than inferred from authorId vs booking.renterId so that
  // "one review per side per booking" is a DB unique constraint, and so
  // "reviews about this listing/owner" is a plain filter, not a per-row compare.
  direction ReviewDirection
  createdAt DateTime        @default(now())

  bookingId String
  booking   Booking @relation(fields: [bookingId], references: [id])

  authorId String
  author   User   @relation("ReviewsAuthored", fields: [authorId], references: [id])

  revieweeId String
  reviewee   User   @relation("ReviewsReceived", fields: [revieweeId], references: [id])

  @@unique([bookingId, direction])
  @@map("reviews")
}
```

- [ ] **Step 3: Add the back-relations on `User`**
In `model User`, in the relation block that currently ends with `messageThreadsAsRenter MessageThread[] @relation("RenterThreads")`, add two lines directly beneath it:
```prisma
  reviewsAuthored Review[] @relation("ReviewsAuthored")
  reviewsReceived Review[] @relation("ReviewsReceived")
```

- [ ] **Step 4: Add the back-relation on `Booking`**
Prisma requires the opposite side of `Review.booking`. In `model Booking`, directly beneath the existing `dispute Dispute?` line, add:
```prisma
  reviews Review[]
```

- [ ] **Step 5: Validate the schema**
Run: `npx prisma validate`
Expected: `The schema at prisma/schema.prisma is valid 🚀`. If it complains about a missing opposite relation field, Step 3 or Step 4 was skipped.

- [ ] **Step 6: Create and apply the migration**
Run: `npx prisma migrate dev --name add_reviews`
Expected: a new `prisma/migrations/<timestamp>_add_reviews/migration.sql` containing `CREATE TYPE "ReviewDirection"`, `CREATE TABLE "reviews"`, and `CREATE UNIQUE INDEX ... ON "reviews"("bookingId", "direction")`; Prisma Client regenerates into `generated/prisma`.

- [ ] **Step 7: Confirm the generated types exist**
Run: `grep -n "ReviewDirection" generated/prisma/enums.ts`
Expected: matches for `export const ReviewDirection = {` and `export type ReviewDirection = (typeof ReviewDirection)[keyof typeof ReviewDirection]`.

- [ ] **Step 8: Commit**
```bash
git add prisma/schema.prisma prisma/migrations generated/prisma
git commit -m "feat(reviews): add Review model and ReviewDirection enum"
```

---

### Task 2: CreateReviewDto + `ReviewsService.create`

**Files:**
- Create: `src/reviews/dto/create-review.dto.ts`
- Create: `src/reviews/reviews.service.ts`
- Test: `src/reviews/reviews.service.spec.ts`

**Interfaces:**
- Consumes: `PrismaService` from `src/prisma/prisma.service`; `ReviewDirection` from `generated/prisma/enums`; `prisma.review.findUnique` / `.create`; `prisma.booking.findUnique`.
- Produces:
  - `class CreateReviewDto { rating: number; comment?: string }`
  - `class ReviewsService { constructor(prisma: PrismaService); create(userId: string, bookingId: string, dto: CreateReviewDto): Promise<Review> }`

- [ ] **Step 1: Write the DTO**
Create `src/reviews/dto/create-review.dto.ts`:
```ts
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  // `direction` and `revieweeId` are deliberately absent — both are derived
  // server-side from the booking, never accepted from the client.
  @IsOptional()
  @IsString()
  comment?: string;
}
```

- [ ] **Step 2: Write the failing tests for `create`**
Create `src/reviews/reviews.service.spec.ts`:
```ts
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';

function makePrisma() {
  return {
    booking: {
      findUnique: jest.fn(),
    },
    review: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      aggregate: jest.fn(),
    },
  } as unknown as PrismaService;
}

const completedBooking = {
  id: 'b1',
  status: 'completed',
  renterId: 'renter-1',
  listingId: 'l1',
  listing: { id: 'l1', ownerId: 'owner-1' },
};

describe('ReviewsService.create', () => {
  it('records a renter_to_owner review when the caller is the renter', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      completedBooking,
    );
    (prisma.review.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.review.create as jest.Mock).mockResolvedValue({ id: 'r1' });

    const service = new ReviewsService(prisma);
    const result = await service.create('renter-1', 'b1', {
      rating: 5,
      comment: 'Great gear',
    });

    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        bookingId: 'b1',
        authorId: 'renter-1',
        revieweeId: 'owner-1',
        direction: 'renter_to_owner',
        rating: 5,
        comment: 'Great gear',
      },
    });
    expect(result).toEqual({ id: 'r1' });
  });

  it('records an owner_to_renter review when the caller is the listing owner', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      completedBooking,
    );
    (prisma.review.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.review.create as jest.Mock).mockResolvedValue({ id: 'r2' });

    const service = new ReviewsService(prisma);
    await service.create('owner-1', 'b1', { rating: 4 });

    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        bookingId: 'b1',
        authorId: 'owner-1',
        revieweeId: 'renter-1',
        direction: 'owner_to_renter',
        rating: 4,
        comment: undefined,
      },
    });
  });

  it('404s when the booking does not exist', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new ReviewsService(prisma);
    await expect(
      service.create('renter-1', 'nope', { rating: 5 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('409s when the booking is not completed', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
      ...completedBooking,
      status: 'confirmed',
    });

    const service = new ReviewsService(prisma);
    await expect(
      service.create('renter-1', 'b1', { rating: 5 }),
    ).rejects.toThrow(ConflictException);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  it('403s when the caller is not a party to the booking', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      completedBooking,
    );

    const service = new ReviewsService(prisma);
    await expect(
      service.create('stranger-1', 'b1', { rating: 5 }),
    ).rejects.toThrow(ForbiddenException);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  it('409s when this side has already reviewed the booking', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      completedBooking,
    );
    (prisma.review.findUnique as jest.Mock).mockResolvedValue({ id: 'r1' });

    const service = new ReviewsService(prisma);
    await expect(
      service.create('renter-1', 'b1', { rating: 5 }),
    ).rejects.toThrow(ConflictException);
    expect(prisma.review.findUnique).toHaveBeenCalledWith({
      where: {
        bookingId_direction: {
          bookingId: 'b1',
          direction: 'renter_to_owner',
        },
      },
    });
    expect(prisma.review.create).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**
Run: `npx jest src/reviews/reviews.service.spec.ts`
Expected: FAIL — `Cannot find module './reviews.service'`.

- [ ] **Step 4: Write the service with only `create`**
Create `src/reviews/reviews.service.ts`:
```ts
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import type { ReviewDirection } from '../../generated/prisma/enums';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, bookingId: string, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'completed') {
      throw new ConflictException('Booking is not completed');
    }

    const isRenter = booking.renterId === userId;
    const isOwner = booking.listing.ownerId === userId;
    if (!isRenter && !isOwner) {
      throw new ForbiddenException('You are not a party to this booking');
    }

    // Direction and reviewee are derived here, never taken from the client.
    const direction: ReviewDirection = isRenter
      ? 'renter_to_owner'
      : 'owner_to_renter';
    const revieweeId = isRenter ? booking.listing.ownerId : booking.renterId;

    // Pre-check for a friendly 409; the @@unique([bookingId, direction])
    // constraint is what actually makes it race-proof.
    const existing = await this.prisma.review.findUnique({
      where: { bookingId_direction: { bookingId, direction } },
    });
    if (existing) {
      throw new ConflictException('You have already reviewed this booking');
    }

    return this.prisma.review.create({
      data: {
        bookingId,
        authorId: userId,
        revieweeId,
        direction,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**
Run: `npx jest src/reviews/reviews.service.spec.ts`
Expected: PASS — 6 passing tests in `ReviewsService.create`.

- [ ] **Step 6: Commit**
```bash
git add src/reviews/dto/create-review.dto.ts src/reviews/reviews.service.ts src/reviews/reviews.service.spec.ts
git commit -m "feat(reviews): add review creation with server-inferred direction"
```

---

### Task 3: Read-path service methods (`findForBooking`, `findForListing`, `findForUser`)

**Files:**
- Modify: `src/reviews/reviews.service.ts` (append three methods to the class)
- Test: `src/reviews/reviews.service.spec.ts` (append three `describe` blocks)

**Interfaces:**
- Consumes: `ReviewsService` and `makePrisma()` from Task 2; `prisma.review.findMany`, `prisma.review.aggregate`.
- Produces:
  - `findForBooking(bookingId: string, userId: string): Promise<Review[]>`
  - `findForListing(listingId: string): Promise<{ average: number | null; count: number; reviews: Review[] }>`
  - `findForUser(revieweeId: string): Promise<{ average: number | null; count: number; reviews: Review[] }>`

- [ ] **Step 1: Write the failing tests**
Append to `src/reviews/reviews.service.spec.ts`:
```ts
describe('ReviewsService.findForBooking', () => {
  it('returns both reviews for a party to the booking', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      completedBooking,
    );
    (prisma.review.findMany as jest.Mock).mockResolvedValue([{ id: 'r1' }]);

    const service = new ReviewsService(prisma);
    const result = await service.findForBooking('b1', 'owner-1');

    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: { bookingId: 'b1' },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual([{ id: 'r1' }]);
  });

  it('404s when the booking does not exist', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(null);

    const service = new ReviewsService(prisma);
    await expect(service.findForBooking('nope', 'renter-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('403s when the caller is not a party to the booking', async () => {
    const prisma = makePrisma();
    (prisma.booking.findUnique as jest.Mock).mockResolvedValue(
      completedBooking,
    );

    const service = new ReviewsService(prisma);
    await expect(service.findForBooking('b1', 'stranger-1')).rejects.toThrow(
      ForbiddenException,
    );
  });
});

describe('ReviewsService.findForListing', () => {
  it('returns renter_to_owner reviews for the listing with a live average', async () => {
    const prisma = makePrisma();
    (prisma.review.findMany as jest.Mock).mockResolvedValue([
      { id: 'r1', rating: 5 },
      { id: 'r2', rating: 4 },
    ]);
    (prisma.review.aggregate as jest.Mock).mockResolvedValue({
      _avg: { rating: 4.5 },
      _count: { rating: 2 },
    });

    const service = new ReviewsService(prisma);
    const result = await service.findForListing('l1');

    const where = {
      direction: 'renter_to_owner',
      booking: { listingId: 'l1' },
    };
    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where,
      orderBy: { createdAt: 'desc' },
    });
    expect(prisma.review.aggregate).toHaveBeenCalledWith({
      where,
      _avg: { rating: true },
      _count: { rating: true },
    });
    expect(result).toEqual({
      average: 4.5,
      count: 2,
      reviews: [
        { id: 'r1', rating: 5 },
        { id: 'r2', rating: 4 },
      ],
    });
  });

  it('returns a null average and zero count when the listing has no reviews', async () => {
    const prisma = makePrisma();
    (prisma.review.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.review.aggregate as jest.Mock).mockResolvedValue({
      _avg: { rating: null },
      _count: { rating: 0 },
    });

    const service = new ReviewsService(prisma);
    const result = await service.findForListing('l1');

    expect(result).toEqual({ average: null, count: 0, reviews: [] });
  });
});

describe('ReviewsService.findForUser', () => {
  it('returns reviews received in both directions with a live average', async () => {
    const prisma = makePrisma();
    (prisma.review.findMany as jest.Mock).mockResolvedValue([
      { id: 'r3', rating: 3 },
    ]);
    (prisma.review.aggregate as jest.Mock).mockResolvedValue({
      _avg: { rating: 3 },
      _count: { rating: 1 },
    });

    const service = new ReviewsService(prisma);
    const result = await service.findForUser('owner-1');

    expect(prisma.review.findMany).toHaveBeenCalledWith({
      where: { revieweeId: 'owner-1' },
      orderBy: { createdAt: 'desc' },
    });
    expect(prisma.review.aggregate).toHaveBeenCalledWith({
      where: { revieweeId: 'owner-1' },
      _avg: { rating: true },
      _count: { rating: true },
    });
    expect(result).toEqual({
      average: 3,
      count: 1,
      reviews: [{ id: 'r3', rating: 3 }],
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**
Run: `npx jest src/reviews/reviews.service.spec.ts`
Expected: FAIL — `service.findForBooking is not a function` (and the same for `findForListing` / `findForUser`). The six Task 2 tests still pass.

- [ ] **Step 3: Implement the three read methods**
Append inside the `ReviewsService` class in `src/reviews/reviews.service.ts`, after `create`:
```ts
  async findForBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.renterId !== userId && booking.listing.ownerId !== userId) {
      throw new ForbiddenException('You are not a party to this booking');
    }

    return this.prisma.review.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findForListing(listingId: string) {
    // Reviews about the gear/owner are exactly the renter_to_owner rows on
    // bookings for this listing.
    const where = {
      direction: 'renter_to_owner' as ReviewDirection,
      booking: { listingId },
    };
    const [reviews, aggregate] = await Promise.all([
      this.prisma.review.findMany({ where, orderBy: { createdAt: 'desc' } }),
      // Averaged live rather than denormalized onto Listing — no write-path
      // recalculation, no drift.
      this.prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return {
      average: aggregate._avg.rating,
      count: aggregate._count.rating,
      reviews,
    };
  }

  async findForUser(revieweeId: string) {
    const where = { revieweeId };
    const [reviews, aggregate] = await Promise.all([
      this.prisma.review.findMany({ where, orderBy: { createdAt: 'desc' } }),
      this.prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return {
      average: aggregate._avg.rating,
      count: aggregate._count.rating,
      reviews,
    };
  }
```

- [ ] **Step 4: Run the tests to verify they pass**
Run: `npx jest src/reviews/reviews.service.spec.ts`
Expected: PASS — 12 tests across four `describe` blocks.

- [ ] **Step 5: Commit**
```bash
git add src/reviews/reviews.service.ts src/reviews/reviews.service.spec.ts
git commit -m "feat(reviews): add booking, listing, and user review queries with live averages"
```

---

### Task 4: Controller, module, and app registration

**Files:**
- Create: `src/reviews/reviews.controller.ts`
- Create: `src/reviews/reviews.module.ts`
- Modify: `src/app.module.ts` (import line beside the other module imports; entry in the `imports` array after `DisputesModule`)

**Interfaces:**
- Consumes: `ReviewsService` with `create(userId, bookingId, dto)`, `findForBooking(bookingId, userId)`, `findForListing(listingId)`, `findForUser(revieweeId)` from Tasks 2–3; `JwtUserAuthGuard`, `CurrentUser`, `UserAuthContext` from `src/auth`.
- Produces: routes `POST /bookings/:bookingId/reviews`, `GET /bookings/:bookingId/reviews`, `GET /listings/:listingId/reviews`, `GET /users/:userId/reviews`.

- [ ] **Step 1: Write the controller**
Create `src/reviews/reviews.controller.ts`. It uses a prefix-less `@Controller()` because the four routes hang off three different path roots, and applies `JwtUserAuthGuard` per-route (the two aggregate GETs are public), the same per-route pattern `ListingsController` uses:
```ts
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtUserAuthGuard)
  @Post('bookings/:bookingId/reviews')
  create(
    @CurrentUser() user: UserAuthContext,
    @Param('bookingId') bookingId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.userId, bookingId, dto);
  }

  @UseGuards(JwtUserAuthGuard)
  @Get('bookings/:bookingId/reviews')
  findForBooking(
    @CurrentUser() user: UserAuthContext,
    @Param('bookingId') bookingId: string,
  ) {
    return this.reviewsService.findForBooking(bookingId, user.userId);
  }

  @Get('listings/:listingId/reviews')
  findForListing(@Param('listingId') listingId: string) {
    return this.reviewsService.findForListing(listingId);
  }

  @Get('users/:userId/reviews')
  findForUser(@Param('userId') userId: string) {
    return this.reviewsService.findForUser(userId);
  }
}
```

- [ ] **Step 2: Write the module**
Create `src/reviews/reviews.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [AuthModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
```

- [ ] **Step 3: Register the module in `src/app.module.ts`**
Add the import beneath the existing `DisputesModule` import line:
```ts
import { ReviewsModule } from './reviews/reviews.module';
```
and add the entry to the `imports` array directly after `DisputesModule,`:
```ts
    ReviewsModule,
```

- [ ] **Step 4: Verify the app compiles and the whole suite passes**
Run: `npm run build && npm test`
Expected: `nest build` completes with no TypeScript errors, and Jest reports all suites passing, including the 12 tests in `src/reviews/reviews.service.spec.ts`.

- [ ] **Step 5: Verify the routes are registered**
Run: `npm run start:dev` and watch the Nest bootstrap log, then stop it with Ctrl-C.
Expected: four `RoutesResolver`/`RouterExplorer` lines mentioning `ReviewsController` — `POST /bookings/:bookingId/reviews`, `GET /bookings/:bookingId/reviews`, `GET /listings/:listingId/reviews`, `GET /users/:userId/reviews`.

- [ ] **Step 6: Commit**
```bash
git add src/reviews/reviews.controller.ts src/reviews/reviews.module.ts src/app.module.ts
git commit -m "feat(reviews): expose review endpoints and register ReviewsModule"
```

---

## Self-Review

**Spec coverage**

| Spec section | Task |
| --- | --- |
| `ReviewDirection` enum, `Review` model, `@@unique`, `@@map`, `User` back-relations, one migration | Task 1 |
| `POST /bookings/:bookingId/reviews` (server-inferred direction, client sends neither `direction` nor `revieweeId`) | Task 2 (service) + Task 4 (route) |
| `GET /bookings/:bookingId/reviews`, party-only | Task 3 (service) + Task 4 (route) |
| `GET /listings/:listingId/reviews`, public, live average + count | Task 3 (service) + Task 4 (route) |
| `GET /users/:userId/reviews`, public, both directions received, live average + count | Task 3 (service) + Task 4 (route) |
| Validation rules 1–3 (exists / completed / party) | Task 2, Step 4 |
| Validation rule 3 duplicate-direction → `ConflictException` | Task 2, Step 4 (`findUnique` on `bookingId_direction`) |
| Validation rule 4 (`@IsInt() @Min(1) @Max(5)`, optional comment) | Task 2, Step 1 |
| Spec test list (happy path both directions, non-completed, non-party, duplicate) + the two aggregate GETs | Task 2, Step 2 and Task 3, Step 1 |
| `src/app.module.ts` registration | Task 4, Step 3 |
| Out-of-scope items | None built; listed under Global Constraints as do-not-build. |

**Placeholder scan:** no "TBD", "TODO", "implement later", "similar to Task N", or bare "add validation"/"handle edge cases" steps. Every code step carries complete, copy-pasteable source. The one deliberately generated artifact is the migration SQL, which `prisma migrate dev` writes.

**Type consistency:** `ReviewDirection` values `'renter_to_owner'` / `'owner_to_renter'` are identical in schema, service, and tests. `create(userId, bookingId, dto)` argument order matches between service, spec, and controller. `findForBooking(bookingId, userId)` order matches between service, spec, and controller. The `{ average, count, reviews }` return shape is identical in the Task 3 interface block, its tests, and its implementation. `bookingId_direction` is the compound-unique name Prisma generates from `@@unique([bookingId, direction])`. `Booking.reviews` (Task 1, Step 4) is required for `Review.booking` to compile — without it `prisma validate` fails.

**Scope check:** single subsystem (reviews only); no split into sub-plans needed.
