# Location-based delivery pricing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the booking page's delivery option charge a fee that scales with the straight-line distance between the renter's and the listing owner's saved addresses, instead of a hardcoded, unused "+$15".

**Architecture:** Both accounts get an optional `address` (geocoded to lat/lng via Nominatim, at save time only) on the `User` model. `/pricing/quote` and booking creation both compute `baseFee + rate*km` (capped) from those coordinates via a shared Haversine util, server-side only — the client never submits a price. The frontend gets two new minimal profile pages to set an address, and the booking page's pickup-method selector becomes a small GET-driven form so picking "Delivery" re-renders the page with the live quote.

**Tech Stack:** NestJS + Prisma 7 + Postgres (`rental-marketplace-api`), Next.js 16 App Router + React 19 (`rental-marketplace`). No new dependencies — geocoding uses global `fetch`, distance math uses stdlib `Math`.

**Spec:** `rental-marketplace-api/docs/superpowers/specs/2026-08-25-location-based-delivery-design.md`

## Global Constraints

- No new npm dependencies in either repo — geocoding via `fetch` to Nominatim's public endpoint, distance via stdlib `Math` (Haversine).
- `lat`/`lng` are never serialized in any API response — only `address` (string) and, on a listing owner's public profile, `hasAddress` (boolean).
- Delivery pricing is always recomputed server-side from stored coordinates, both at `/pricing/quote` and at booking creation — a client-submitted fee is never trusted.
- `DELIVERY_BASE_FEE = 5`, `DELIVERY_RATE_PER_KM = 0.5`, `DELIVERY_MAX_FEE = 50` — currency-agnostic plain numbers, same convention as the existing `SERVICE_FEE_RATE`/`TAX_RATE`.
- Booking pages stay Server Components; the only new client component is the pickup-method radio pair (a "filter form" leaf, matching the project's existing exception for interactive leaves).

Paths below are relative to `/Users/abdul.rehman/Development/projects/gearloop/`, prefixed by repo (`rental-marketplace-api/...` or `rental-marketplace/...`).

---

## Task 1: Schema migration — address fields on User, deliveryFee on Booking

**Files:**
- Modify: `rental-marketplace-api/prisma/schema.prisma`

**Interfaces:**
- Produces: `User.address: String?`, `User.lat: Decimal? @db.Decimal(9,6)`, `User.lng: Decimal? @db.Decimal(9,6)`, `Booking.deliveryFee: Decimal @default(0) @db.Decimal(10,2)` — every later backend task reads/writes these columns.

- [ ] **Step 1: Add the columns to the schema**

In `rental-marketplace-api/prisma/schema.prisma`, in `model User`, add after the `deletedAt` field:

```prisma
  // Renter's delivery point / owner's dispatch point. Geocoded once at
  // save time (src/common/geocoding.ts) — never re-derived from bookings.
  // lat/lng are never serialized to any API response; only `address` and,
  // on a public profile, the derived `hasAddress` boolean are.
  address String?
  lat     Decimal? @db.Decimal(9, 6)
  lng     Decimal? @db.Decimal(9, 6)
```

In `model Booking`, add `deliveryFee` next to the other pricing snapshot columns (after `tax`, before `total`):

```prisma
  deliveryFee Decimal @default(0) @db.Decimal(10, 2)
```

- [ ] **Step 2: Generate and run the migration**

Run: `cd rental-marketplace-api && npx prisma migrate dev --name add_location_based_delivery`
Expected: migration applies cleanly, Prisma Client regenerates. No existing rows break since both new `User` columns are nullable and `deliveryFee` defaults to `0`.

- [ ] **Step 3: Commit**

```bash
cd rental-marketplace-api
git add prisma/schema.prisma prisma/migrations
git commit -m "Add address/lat/lng to User and deliveryFee to Booking"
```

---

## Task 2: Geocoding helper

**Files:**
- Create: `rental-marketplace-api/src/common/geocoding.ts`
- Test: `rental-marketplace-api/src/common/geocoding.spec.ts`

**Interfaces:**
- Produces: `export interface GeoPoint { lat: number; lng: number }`, `export async function geocodeAddress(address: string): Promise<GeoPoint | null>` — consumed by Task 4 (`UsersService.update`).

- [ ] **Step 1: Write the failing test**

Create `rental-marketplace-api/src/common/geocoding.spec.ts`:

```ts
import { geocodeAddress } from './geocoding';

describe('geocodeAddress', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns coordinates for a successful lookup', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ lat: '-33.9249', lon: '18.4241' }],
    }) as unknown as typeof fetch;

    const point = await geocodeAddress('Cape Town, South Africa');

    expect(point).toEqual({ lat: -33.9249, lng: 18.4241 });
  });

  it('returns null when no results are found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as unknown as typeof fetch;

    const point = await geocodeAddress('asdkfjhaslkdjfh nonsense address');

    expect(point).toBeNull();
  });

  it('returns null when the request fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    const point = await geocodeAddress('Cape Town');

    expect(point).toBeNull();
  });

  it('sends a descriptive User-Agent header, per Nominatim usage policy', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ lat: '0', lon: '0' }],
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await geocodeAddress('Null Island');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)['User-Agent']).toContain(
      'Gearloop',
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd rental-marketplace-api && npx jest src/common/geocoding.spec.ts`
Expected: FAIL — `Cannot find module './geocoding'`.

- [ ] **Step 3: Write the implementation**

Create `rental-marketplace-api/src/common/geocoding.ts`:

```ts
export interface GeoPoint {
  lat: number;
  lng: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

// Nominatim's public instance: free, no API key, but requires a descriptive
// User-Agent and tolerates only light usage (1 req/sec). Fine here since
// this only runs at profile-save time, never on the booking/pricing hot
// path. See spec's "Out of scope" for why there's no caching/retry here.
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocodeAddress(address: string): Promise<GeoPoint | null> {
  const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(address)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Gearloop/1.0 (rental-marketplace-api)' },
  });
  if (!res.ok) return null;

  const results = (await res.json()) as NominatimResult[];
  const first = results[0];
  if (!first) return null;

  return { lat: Number(first.lat), lng: Number(first.lon) };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd rental-marketplace-api && npx jest src/common/geocoding.spec.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
cd rental-marketplace-api
git add src/common/geocoding.ts src/common/geocoding.spec.ts
git commit -m "Add Nominatim-backed geocoding helper"
```

---

## Task 3: Delivery distance/fee util

**Files:**
- Create: `rental-marketplace-api/src/bookings/delivery-pricing.util.ts`
- Test: `rental-marketplace-api/src/bookings/delivery-pricing.util.spec.ts`

**Interfaces:**
- Consumes: nothing (pure function, no dependency on Task 2).
- Produces: `export interface GeoPoint { lat: number; lng: number }`, `export const DELIVERY_BASE_FEE = 5`, `export const DELIVERY_RATE_PER_KM = 0.5`, `export const DELIVERY_MAX_FEE = 50`, `export function haversineKm(a: GeoPoint, b: GeoPoint): number`, `export function deliveryFeeForDistance(km: number): number` — consumed by Task 5 (`PricingController`) and Task 6 (`BookingsService`).

- [ ] **Step 1: Write the failing test**

Create `rental-marketplace-api/src/bookings/delivery-pricing.util.spec.ts`:

```ts
import {
  DELIVERY_BASE_FEE,
  DELIVERY_MAX_FEE,
  DELIVERY_RATE_PER_KM,
  deliveryFeeForDistance,
  haversineKm,
} from './delivery-pricing.util';

describe('haversineKm', () => {
  it('returns 0 for identical points', () => {
    const point = { lat: -33.9249, lng: 18.4241 };
    expect(haversineKm(point, point)).toBe(0);
  });

  it('computes the distance between Cape Town and Johannesburg (~1265km)', () => {
    const capeTown = { lat: -33.9249, lng: 18.4241 };
    const johannesburg = { lat: -26.2041, lng: 28.0473 };
    const km = haversineKm(capeTown, johannesburg);
    expect(km).toBeGreaterThan(1200);
    expect(km).toBeLessThan(1350);
  });
});

describe('deliveryFeeForDistance', () => {
  it('returns just the base fee at zero distance', () => {
    expect(deliveryFeeForDistance(0)).toBe(DELIVERY_BASE_FEE);
  });

  it('scales linearly with distance below the cap', () => {
    expect(deliveryFeeForDistance(10)).toBe(
      DELIVERY_BASE_FEE + DELIVERY_RATE_PER_KM * 10,
    );
  });

  it('caps at the max fee for long distances', () => {
    expect(deliveryFeeForDistance(1000)).toBe(DELIVERY_MAX_FEE);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd rental-marketplace-api && npx jest src/bookings/delivery-pricing.util.spec.ts`
Expected: FAIL — `Cannot find module './delivery-pricing.util'`.

- [ ] **Step 3: Write the implementation**

Create `rental-marketplace-api/src/bookings/delivery-pricing.util.ts`:

```ts
export interface GeoPoint {
  lat: number;
  lng: number;
}

// Currency-agnostic plain numbers, same convention as SERVICE_FEE_RATE/
// TAX_RATE in booking-pricing.util.ts — this app does no FX conversion.
export const DELIVERY_BASE_FEE = 5;
export const DELIVERY_RATE_PER_KM = 0.5;
export const DELIVERY_MAX_FEE = 50;

const EARTH_RADIUS_KM = 6371;

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function deliveryFeeForDistance(km: number): number {
  const fee = DELIVERY_BASE_FEE + DELIVERY_RATE_PER_KM * km;
  return Math.min(fee, DELIVERY_MAX_FEE);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd rental-marketplace-api && npx jest src/bookings/delivery-pricing.util.spec.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
cd rental-marketplace-api
git add src/bookings/delivery-pricing.util.ts src/bookings/delivery-pricing.util.spec.ts
git commit -m "Add Haversine distance and delivery fee util"
```

---

## Task 4: User address — DTO, geocode-on-save, public hasAddress

**Files:**
- Modify: `rental-marketplace-api/src/users/dto/update-user.dto.ts`
- Modify: `rental-marketplace-api/src/users/users.service.ts`
- Test: `rental-marketplace-api/src/users/users.service.spec.ts` (new file)

**Interfaces:**
- Consumes: `geocodeAddress` from Task 2 (`../common/geocoding`).
- Produces: `UpdateUserDto.address?: string`; `UsersService.update()`/`.me()` responses include `address: string | null` and never `lat`/`lng`; `UsersService.findPublicProfile()` response includes `hasAddress: boolean` — consumed by Task 9 (frontend `Owner`/`User` types).

- [ ] **Step 1: Add `address` to the DTO**

In `rental-marketplace-api/src/users/dto/update-user.dto.ts`, replace the whole file:

```ts
import { IsOptional, IsString, MaxLength } from 'class-validator';

// name/responseTime/address only — email, passwordHash, isOwner, memberSince
// are never user-editable through this endpoint.
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  responseTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;
}
```

- [ ] **Step 2: Write the failing test**

Create `rental-marketplace-api/src/users/users.service.spec.ts`:

```ts
import { BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as geocoding from '../common/geocoding';

jest.mock('../common/geocoding');

function makePrisma() {
  return {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  } as unknown as PrismaService;
}

const baseUser = {
  id: 'u1',
  name: 'Renter One',
  email: 'renter@example.com',
  passwordHash: 'hash',
  initials: 'RO',
  isOwner: false,
  isSuspended: false,
  memberSince: new Date('2026-01-01'),
  responseTime: null,
  deletedAt: null,
  address: null,
  lat: null,
  lng: null,
};

describe('UsersService.update', () => {
  it('geocodes and stores the address on success', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(baseUser);
    (geocoding.geocodeAddress as jest.Mock).mockResolvedValue({
      lat: -33.9249,
      lng: 18.4241,
    });
    (prisma.user.update as jest.Mock).mockResolvedValue({
      ...baseUser,
      address: '1 Long St, Cape Town',
      lat: -33.9249,
      lng: 18.4241,
    });

    const service = new UsersService(prisma);
    const result = await service.update('u1', {
      address: '1 Long St, Cape Town',
    });

    expect(geocoding.geocodeAddress).toHaveBeenCalledWith(
      '1 Long St, Cape Town',
    );
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          address: '1 Long St, Cape Town',
          lat: -33.9249,
          lng: 18.4241,
        }),
      }),
    );
    expect(result.address).toBe('1 Long St, Cape Town');
    expect(result).not.toHaveProperty('lat');
    expect(result).not.toHaveProperty('lng');
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('rejects the update when the address cannot be geocoded', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(baseUser);
    (geocoding.geocodeAddress as jest.Mock).mockResolvedValue(null);

    const service = new UsersService(prisma);

    await expect(
      service.update('u1', { address: 'nonsense' }),
    ).rejects.toThrow(BadRequestException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('does not geocode when address is not part of the update', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(baseUser);
    (prisma.user.update as jest.Mock).mockResolvedValue(baseUser);

    const service = new UsersService(prisma);
    await service.update('u1', { name: 'New Name' });

    expect(geocoding.geocodeAddress).not.toHaveBeenCalled();
  });
});

describe('UsersService.findPublicProfile', () => {
  it('reports hasAddress true when lat/lng are set', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...baseUser,
      lat: -33.9249,
      lng: 18.4241,
    });

    const service = new UsersService(prisma);
    const profile = await service.findPublicProfile('u1');

    expect(profile.hasAddress).toBe(true);
    expect(profile).not.toHaveProperty('address');
    expect(profile).not.toHaveProperty('lat');
  });

  it('reports hasAddress false when lat/lng are null', async () => {
    const prisma = makePrisma();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(baseUser);

    const service = new UsersService(prisma);
    const profile = await service.findPublicProfile('u1');

    expect(profile.hasAddress).toBe(false);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd rental-marketplace-api && npx jest src/users/users.service.spec.ts`
Expected: FAIL — `hasAddress`/geocoding assertions fail against the current implementation.

- [ ] **Step 4: Update the service**

Replace `rental-marketplace-api/src/users/users.service.ts` in full:

```ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { computeInitials } from '../auth/utils/initials.util';
import { geocodeAddress } from '../common/geocoding';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.findByIdOrThrow(userId);
    return this.sanitize(user);
  }

  async update(userId: string, dto: UpdateUserDto) {
    await this.findByIdOrThrow(userId);

    let geo: { lat: number; lng: number } | undefined;
    if (dto.address !== undefined) {
      const point = await geocodeAddress(dto.address);
      if (!point) throw new BadRequestException('Address not found');
      geo = point;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        ...(dto.name && { initials: computeInitials(dto.name) }),
        ...(geo && { lat: geo.lat, lng: geo.lng }),
      },
    });
    return this.sanitize(user);
  }

  async findPublicProfile(id: string) {
    const user = await this.findByIdOrThrow(id);
    // Public view: no email, no passwordHash, no address/coordinates —
    // only what's safe to show a stranger browsing a listing. hasAddress
    // lets the renter know delivery is possible without seeing where.
    const { id: userId, name, initials, isOwner, memberSince, responseTime, lat, lng } =
      user;
    return {
      id: userId,
      name,
      initials,
      isOwner,
      memberSince,
      responseTime,
      hasAddress: lat !== null && lng !== null,
    };
  }

  private async findByIdOrThrow(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) throw new NotFoundException('User not found');
    return user;
  }

  private sanitize(user: {
    passwordHash: string;
    lat: unknown;
    lng: unknown;
    [key: string]: unknown;
  }) {
    const { passwordHash: _passwordHash, lat: _lat, lng: _lng, ...rest } = user;
    return rest;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd rental-marketplace-api && npx jest src/users/users.service.spec.ts`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
cd rental-marketplace-api
git add src/users/dto/update-user.dto.ts src/users/users.service.ts src/users/users.service.spec.ts
git commit -m "Geocode address on profile save; expose hasAddress on public profiles"
```

---

## Task 5: Delivery pricing on the quote endpoint

**Files:**
- Modify: `rental-marketplace-api/src/pricing/dto/quote.dto.ts`
- Modify: `rental-marketplace-api/src/pricing/pricing.controller.ts`
- Modify: `rental-marketplace-api/src/pricing/pricing.module.ts`
- Modify: `rental-marketplace-api/src/pricing/pricing.controller.spec.ts`

**Interfaces:**
- Consumes: `haversineKm`, `deliveryFeeForDistance` from Task 3 (`../bookings/delivery-pricing.util`); `PrismaService` (global); `OptionalJwtUserAuthGuard`, `CurrentUser`, `UserAuthContext` from the existing auth module.
- Produces: `GET /pricing/quote` response gains `deliveryFee: string` (always present, `"0.00"` for pickup) and folds it into `total` — consumed by Task 10 (frontend `getQuote`).

- [ ] **Step 1: Extend the DTO**

Replace `rental-marketplace-api/src/pricing/dto/quote.dto.ts` in full:

```ts
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsUUID, Min } from 'class-validator';
import { PickupMethod } from '../../../generated/prisma/enums';

export class QuoteDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pricePerDay!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  nights!: number;

  @IsOptional()
  @IsEnum(PickupMethod)
  pickupMethod?: PickupMethod;

  @IsOptional()
  @IsUUID()
  listingId?: string;
}
```

- [ ] **Step 2: Write the failing test**

Replace `rental-marketplace-api/src/pricing/pricing.controller.spec.ts` in full:

```ts
import { PricingController } from './pricing.controller';
import { PrismaService } from '../prisma/prisma.service';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

function makePrisma() {
  return {
    listing: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
  } as unknown as PrismaService;
}

const renter: UserAuthContext = {
  userId: 'renter-1',
  email: 'renter@example.com',
  isOwner: false,
};

describe('PricingController', () => {
  it('matches the API pricing formula for a $200 subtotal', async () => {
    const controller = new PricingController(makePrisma());

    const quote = await controller.quote({ pricePerDay: 100, nights: 2 });

    expect(quote.subtotal).toBe('200.00');
    expect(quote.serviceFee).toBe('20.00');
    expect(quote.tax).toBe('17.60');
    expect(quote.deliveryFee).toBe('0.00');
    expect(quote.total).toBe('237.60');
  });

  it('adds a distance-based delivery fee when both parties have addresses', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      owner: { lat: -33.9249, lng: 18.4241 }, // Cape Town
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      lat: -26.2041,
      lng: 28.0473, // Johannesburg — well past the distance cap
    });
    const controller = new PricingController(prisma);

    const quote = await controller.quote(
      { pricePerDay: 100, nights: 2, pickupMethod: 'delivery', listingId: 'l1' },
      renter,
    );

    expect(quote.deliveryFee).toBe('50.00');
    expect(quote.total).toBe('287.60');
  });

  it('rejects delivery pricing when the caller is not signed in', async () => {
    const controller = new PricingController(makePrisma());

    await expect(
      controller.quote({
        pricePerDay: 100,
        nights: 2,
        pickupMethod: 'delivery',
        listingId: 'l1',
      }),
    ).rejects.toThrow('Sign in to get delivery pricing');
  });

  it('rejects delivery pricing when the renter has no address', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      owner: { lat: -33.9249, lng: 18.4241 },
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      lat: null,
      lng: null,
    });
    const controller = new PricingController(prisma);

    await expect(
      controller.quote(
        { pricePerDay: 100, nights: 2, pickupMethod: 'delivery', listingId: 'l1' },
        renter,
      ),
    ).rejects.toThrow('Add your address');
  });

  it('rejects delivery pricing when the owner has no address', async () => {
    const prisma = makePrisma();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue({
      owner: { lat: null, lng: null },
    });
    const controller = new PricingController(prisma);

    await expect(
      controller.quote(
        { pricePerDay: 100, nights: 2, pickupMethod: 'delivery', listingId: 'l1' },
        renter,
      ),
    ).rejects.toThrow('has not set a delivery address');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd rental-marketplace-api && npx jest src/pricing/pricing.controller.spec.ts`
Expected: FAIL — `PricingController` doesn't take constructor args / has no `deliveryFee` in its response yet.

- [ ] **Step 4: Update the controller**

Replace `rental-marketplace-api/src/pricing/pricing.controller.ts` in full:

```ts
import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QuoteDto } from './dto/quote.dto';
import {
  calculateBookingPricing,
  SERVICE_FEE_RATE,
  TAX_RATE,
} from '../bookings/booking-pricing.util';
import { deliveryFeeForDistance, haversineKm } from '../bookings/delivery-pricing.util';
import { PrismaService } from '../prisma/prisma.service';
import { OptionalJwtUserAuthGuard } from '../auth/guards/optional-jwt-user-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserAuthContext } from '../auth/strategies/jwt-user.strategy';

@Controller('pricing')
export class PricingController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(OptionalJwtUserAuthGuard)
  @Get('quote')
  async quote(@Query() dto: QuoteDto, @CurrentUser() user?: UserAuthContext) {
    const { subtotal, serviceFee, tax, total } = calculateBookingPricing(
      dto.pricePerDay,
      dto.nights,
    );
    const deliveryFee = await this.resolveDeliveryFee(dto, user);

    return {
      pricePerDay: dto.pricePerDay,
      nights: dto.nights,
      subtotal: subtotal.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      tax: tax.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      total: total.plus(deliveryFee).toFixed(2),
      serviceFeeRate: Number(SERVICE_FEE_RATE),
      taxRate: Number(TAX_RATE),
    };
  }

  // Never trusts a client-submitted fee — always recomputed from stored
  // coordinates. Same recomputation happens again in BookingsService.create
  // at actual booking time.
  private async resolveDeliveryFee(
    dto: QuoteDto,
    user?: UserAuthContext,
  ): Promise<number> {
    if (dto.pickupMethod !== 'delivery') return 0;
    if (!dto.listingId) {
      throw new BadRequestException('listingId is required for delivery pricing');
    }
    if (!user) {
      throw new BadRequestException('Sign in to get delivery pricing');
    }

    const [listing, renter] = await Promise.all([
      this.prisma.listing.findUnique({
        where: { id: dto.listingId },
        select: { owner: { select: { lat: true, lng: true } } },
      }),
      this.prisma.user.findUnique({
        where: { id: user.userId },
        select: { lat: true, lng: true },
      }),
    ]);

    if (!listing) throw new BadRequestException('Listing not found');
    if (listing.owner.lat === null || listing.owner.lng === null) {
      throw new BadRequestException('This owner has not set a delivery address');
    }
    if (!renter || renter.lat === null || renter.lng === null) {
      throw new BadRequestException(
        'Add your address in your profile to get delivery pricing',
      );
    }

    const km = haversineKm(
      { lat: Number(listing.owner.lat), lng: Number(listing.owner.lng) },
      { lat: Number(renter.lat), lng: Number(renter.lng) },
    );
    return deliveryFeeForDistance(km);
  }
}
```

- [ ] **Step 5: Wire auth into the module**

Replace `rental-marketplace-api/src/pricing/pricing.module.ts` in full:

```ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PricingController } from './pricing.controller';

@Module({
  imports: [AuthModule],
  controllers: [PricingController],
})
export class PricingModule {}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `cd rental-marketplace-api && npx jest src/pricing/pricing.controller.spec.ts`
Expected: PASS (5 tests).

- [ ] **Step 7: Commit**

```bash
cd rental-marketplace-api
git add src/pricing/dto/quote.dto.ts src/pricing/pricing.controller.ts src/pricing/pricing.module.ts src/pricing/pricing.controller.spec.ts
git commit -m "Compute distance-based delivery fee in /pricing/quote"
```

---

## Task 6: Delivery pricing on booking creation

**Files:**
- Modify: `rental-marketplace-api/src/bookings/bookings.service.ts`
- Modify: `rental-marketplace-api/src/bookings/bookings.service.spec.ts`

**Interfaces:**
- Consumes: `haversineKm`, `deliveryFeeForDistance` from Task 3.
- Produces: `Booking.deliveryFee` is set and folded into `Booking.total` whenever `dto.pickupMethod === 'delivery'`.

- [ ] **Step 1: Write the failing test**

In `rental-marketplace-api/src/bookings/bookings.service.spec.ts`, update `makePrisma()` to add a `user` mock (needed for the delivery-fee lookup) and add a new `describe` block. First, change `makePrisma`:

```ts
function makePrisma() {
  return {
    listing: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    booking: {
      findUnique: jest.fn(),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
    },
    blackout: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
  } as unknown as PrismaService;
}
```

Then add, after the existing `describe('BookingsService.create', ...)` tests in the same file (same `listing` const already defined there is reused):

```ts
describe('BookingsService.create — delivery pricing', () => {
  const deliveryDto = {
    listingId: 'l1',
    pickupMethod: 'delivery' as const,
    startDate: '2026-09-01',
    endDate: '2026-09-03',
  };

  it('adds a distance-based deliveryFee when both parties have addresses', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce({ lat: -33.9249, lng: 18.4241 }) // owner
      .mockResolvedValueOnce({ lat: -26.2041, lng: 28.0473 }); // renter
    (prisma.booking.create as jest.Mock).mockResolvedValue({
      id: 'b1',
      requestNumber: 'GL-1',
    });

    const service = new BookingsService(prisma, notifications);
    await service.create('renter-1', deliveryDto);

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ deliveryFee: 50 }),
      }),
    );
  });

  it('rejects a delivery booking when the renter has no address', async () => {
    const prisma = makePrisma();
    const notifications = makeNotifications();
    (prisma.listing.findUnique as jest.Mock).mockResolvedValue(listing);
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce({ lat: -33.9249, lng: 18.4241 }) // owner
      .mockResolvedValueOnce({ lat: null, lng: null }); // renter

    const service = new BookingsService(prisma, notifications);

    await expect(service.create('renter-1', deliveryDto)).rejects.toThrow(
      'Add your address',
    );
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd rental-marketplace-api && npx jest src/bookings/bookings.service.spec.ts`
Expected: FAIL — new tests fail (`deliveryFee` never set / no rejection thrown); confirm the pre-existing tests in this file still pass at this point (they should, since `makePrisma`'s new `user` mock doesn't affect the pickup-method path).

- [ ] **Step 3: Update the service**

In `rental-marketplace-api/src/bookings/bookings.service.ts`:

Add the import, after the existing `chargeCurrency` import:

```ts
import { deliveryFeeForDistance, haversineKm } from './delivery-pricing.util';
```

Replace the pricing block inside `create()` (currently lines 51–57) with:

```ts
    const nights = Math.round((end.getTime() - start.getTime()) / 86_400_000);
    const { subtotal, serviceFee, tax, total: baseTotal } = calculateBookingPricing(
      listing.pricePerDay,
      nights,
    );
    const deliveryFee = await this.resolveDeliveryFee(
      dto.pickupMethod,
      renterId,
      listing.ownerId,
    );
    const total = baseTotal.plus(deliveryFee);
    const depositAmount = new Prisma.Decimal(listing.depositAmount ?? 0);
    const currency = chargeCurrency(listing.country);
```

Add `deliveryFee` to the `data` object passed to `this.prisma.booking.create` (alongside the existing `tax`, before `total`):

```ts
          tax,
          deliveryFee,
          total,
```

Add the new private method, near `resolveDeliveryFee`'s natural neighbors (after `create()`, before `getBookingOrThrow`):

```ts
  // Same recomputation as PricingController#resolveDeliveryFee — kept
  // separate rather than shared because the two callers have different
  // inputs (a raw ownerId/renterId pair here vs. an authenticated caller +
  // listingId lookup there) and different error framing needs.
  private async resolveDeliveryFee(
    pickupMethod: CreateBookingDto['pickupMethod'],
    renterId: string,
    ownerId: string,
  ): Promise<number> {
    if (pickupMethod !== 'delivery') return 0;

    const [owner, renter] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: ownerId },
        select: { lat: true, lng: true },
      }),
      this.prisma.user.findUnique({
        where: { id: renterId },
        select: { lat: true, lng: true },
      }),
    ]);

    if (!owner || owner.lat === null || owner.lng === null) {
      throw new BadRequestException('This owner has not set a delivery address');
    }
    if (!renter || renter.lat === null || renter.lng === null) {
      throw new BadRequestException(
        'Add your address in your profile to get delivery pricing',
      );
    }

    const km = haversineKm(
      { lat: Number(owner.lat), lng: Number(owner.lng) },
      { lat: Number(renter.lat), lng: Number(renter.lng) },
    );
    return deliveryFeeForDistance(km);
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd rental-marketplace-api && npx jest src/bookings/bookings.service.spec.ts`
Expected: PASS (all tests, old and new).

- [ ] **Step 5: Run the full backend test suite**

Run: `cd rental-marketplace-api && npm test`
Expected: PASS — confirms nothing else (e.g. other snapshots of the booking `data` shape) broke.

- [ ] **Step 6: Commit**

```bash
cd rental-marketplace-api
git add src/bookings/bookings.service.ts src/bookings/bookings.service.spec.ts
git commit -m "Recompute delivery fee server-side on booking creation"
```

---

## Task 7: Frontend types and API client — address, hasAddress, deliveryFee

**Files:**
- Modify: `rental-marketplace/types/index.ts`
- Modify: `rental-marketplace/lib/api/users.ts`
- Modify: `rental-marketplace/lib/api/pricing.ts`

**Interfaces:**
- Produces: `User.address: string | null`; `Owner.hasAddress: boolean`; `PriceBreakdown.deliveryFee: number`; `updateCurrentUser(input: { name?; responseTime?; address? })`; `getQuote(pricePerDay, nights, options?: { pickupMethod?: PickupMethod; listingId?: string })` — consumed by Task 8, Task 9, Task 10.

- [ ] **Step 1: Update types**

In `rental-marketplace/types/index.ts`, update `Owner`:

```ts
export interface Owner {
  id: string;
  name: string;
  initials: string;
  memberSince: number;
  responseTime: string;
  hasAddress: boolean;
}
```

Update `User`:

```ts
export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  isOwner: boolean;
  memberSince: string;
  responseTime: string | null;
  address: string | null;
}
```

Update `PriceBreakdown`:

```ts
export interface PriceBreakdown {
  nights: number;
  pricePerDay: number;
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  tax: number;
  total: number;
}
```

- [ ] **Step 2: Update `lib/api/users.ts`**

Replace `rental-marketplace/lib/api/users.ts` in full:

```ts
import { apiClient, ApiError } from "@/lib/api/client";
import type { Owner, User } from "@/types";

interface ApiUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  isOwner: boolean;
  memberSince: string;
  responseTime: string | null;
  address: string | null;
}

interface ApiPublicProfile {
  id: string;
  name: string;
  initials: string;
  isOwner: boolean;
  memberSince: string;
  responseTime: string | null;
  hasAddress: boolean;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await apiClient.get<ApiUser>("/users/me");
  } catch (err) {
    if (err instanceof ApiError) return null;
    throw err;
  }
}

export async function getPublicProfile(userId: string): Promise<Owner> {
  const profile = await apiClient.get<ApiPublicProfile>(`/users/${userId}`);
  return {
    id: profile.id,
    name: profile.name,
    initials: profile.initials,
    memberSince: new Date(profile.memberSince).getFullYear(),
    responseTime: profile.responseTime ?? "New to Gearloop",
    hasAddress: profile.hasAddress,
  };
}

export async function updateCurrentUser(input: {
  name?: string;
  responseTime?: string;
  address?: string;
}): Promise<User> {
  return apiClient.patch<ApiUser>("/users/me", input);
}
```

- [ ] **Step 3: Update `lib/api/pricing.ts`**

Replace `rental-marketplace/lib/api/pricing.ts` in full:

```ts
import { apiClient } from "@/lib/api/client";
import type { PickupMethod, PriceBreakdown } from "@/types";

interface ApiQuote {
  pricePerDay: number;
  nights: number;
  subtotal: string;
  serviceFee: string;
  deliveryFee: string;
  tax: string;
  total: string;
}

export async function getQuote(
  pricePerDay: number,
  nights: number,
  options?: { pickupMethod?: PickupMethod; listingId?: string },
): Promise<PriceBreakdown> {
  const params = new URLSearchParams({
    pricePerDay: String(pricePerDay),
    nights: String(nights),
  });
  if (options?.pickupMethod) params.set("pickupMethod", options.pickupMethod);
  if (options?.listingId) params.set("listingId", options.listingId);

  const quote = await apiClient.get<ApiQuote>(`/pricing/quote?${params}`);
  return {
    pricePerDay: quote.pricePerDay,
    nights: quote.nights,
    subtotal: Number(quote.subtotal),
    serviceFee: Number(quote.serviceFee),
    deliveryFee: Number(quote.deliveryFee),
    tax: Number(quote.tax),
    total: Number(quote.total),
  };
}
```

- [ ] **Step 4: Type-check**

Run: `cd rental-marketplace && npm run build`
Expected: fails at this point — `app/renter/listings/[id]/book/page.tsx` builds the fallback `pricing` object (the `nights <= 0` branch) without `deliveryFee`, and `PriceSummary`/booking page aren't updated yet. That's expected; Task 9 and Task 10 fix it. Confirm the failure is specifically about the missing `deliveryFee` field and not a typo in this task's files.

- [ ] **Step 5: Commit**

```bash
cd rental-marketplace
git add types/index.ts lib/api/users.ts lib/api/pricing.ts
git commit -m "Add address/hasAddress/deliveryFee to frontend types and API client"
```

---

## Task 8: Profile pages

**Files:**
- Create: `rental-marketplace/actions/profile.ts`
- Create: `rental-marketplace/app/renter/profile/page.tsx`
- Create: `rental-marketplace/app/owner/profile/page.tsx`

**Interfaces:**
- Consumes: `updateCurrentUser`, `getCurrentUser` from Task 7 (`lib/api/users`); `ApiError` from `lib/api/client`; `Input`, `Label`, `Button` from `components/ui/*`.
- Produces: reachable routes `/renter/profile` and `/owner/profile`, each showing/editing `User.address` — consumed by Task 10 (the booking page links here).

- [ ] **Step 1: Add the server action**

Create `rental-marketplace/actions/profile.ts`:

```ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateCurrentUser } from "@/lib/api/users";
import { ApiError } from "@/lib/api/client";

export async function updateAddressAction(formData: FormData) {
  const address = String(formData.get("address") ?? "").trim();
  const returnTo = String(formData.get("returnTo") ?? "/renter/profile");

  if (!address) {
    redirect(`${returnTo}?error=${encodeURIComponent("Enter an address")}`);
  }

  try {
    await updateCurrentUser({ address });
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : "Could not save address";
    redirect(`${returnTo}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/renter/profile");
  revalidatePath("/owner/profile");
  redirect(`${returnTo}?saved=1`);
}
```

- [ ] **Step 2: Add the renter profile page**

Create `rental-marketplace/app/renter/profile/page.tsx`:

```tsx
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/api/users";
import { updateAddressAction } from "@/actions/profile";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function RenterProfilePage({
  searchParams,
}: PageProps<"/renter/profile">) {
  const search = await searchParams;
  const error = typeof search.error === "string" ? search.error : undefined;
  const saved = search.saved === "1";
  const user = await getCurrentUser();

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-7 pb-16 max-w-lg">
      <h1 className="text-xl font-bold mb-6">Profile</h1>

      {error && (
        <div className="flex gap-2 items-start px-3.5 py-3 rounded-md bg-error-tint mb-5">
          <div className="text-sm text-error-tint-text">{error}</div>
        </div>
      )}
      {saved && (
        <div className="flex gap-2 items-start px-3.5 py-3 rounded-md bg-success-tint mb-5">
          <div className="text-sm text-success-tint-text">Address saved.</div>
        </div>
      )}

      <form action={updateAddressAction} className="flex flex-col gap-4">
        <input type="hidden" name="returnTo" value="/renter/profile" />
        <div>
          <Label htmlFor="address">Delivery address</Label>
          <Input
            id="address"
            name="address"
            defaultValue={user?.address ?? ""}
            placeholder="1 Long St, Cape Town, South Africa"
          />
        </div>
        <Button type="submit">Save address</Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Add the owner profile page**

Create `rental-marketplace/app/owner/profile/page.tsx` — identical structure, different copy/return path:

```tsx
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/api/users";
import { updateAddressAction } from "@/actions/profile";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function OwnerProfilePage({
  searchParams,
}: PageProps<"/owner/profile">) {
  const search = await searchParams;
  const error = typeof search.error === "string" ? search.error : undefined;
  const saved = search.saved === "1";
  const user = await getCurrentUser();

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-7 pb-16 max-w-lg">
      <h1 className="text-xl font-bold mb-6">Profile</h1>

      {error && (
        <div className="flex gap-2 items-start px-3.5 py-3 rounded-md bg-error-tint mb-5">
          <div className="text-sm text-error-tint-text">{error}</div>
        </div>
      )}
      {saved && (
        <div className="flex gap-2 items-start px-3.5 py-3 rounded-md bg-success-tint mb-5">
          <div className="text-sm text-success-tint-text">Address saved.</div>
        </div>
      )}

      <form action={updateAddressAction} className="flex flex-col gap-4">
        <input type="hidden" name="returnTo" value="/owner/profile" />
        <div>
          <Label htmlFor="address">Dispatch address</Label>
          <Input
            id="address"
            name="address"
            defaultValue={user?.address ?? ""}
            placeholder="1 Long St, Cape Town, South Africa"
          />
          <p className="text-xs text-text-muted mt-1.5">
            Used to calculate delivery pricing for renters.
          </p>
        </div>
        <Button type="submit">Save address</Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Type-check and lint**

Run: `cd rental-marketplace && npm run build && npm run lint`
Expected: `next build` succeeds in generating `PageProps<'/renter/profile'>` and `PageProps<'/owner/profile'>` for these new routes and type-checks both files cleanly (the earlier `deliveryFee`-related failure from Task 7 Step 4 may still be present — that's expected until Task 9/10). `npm run lint` reports no new warnings from these three files.

- [ ] **Step 5: Commit**

```bash
cd rental-marketplace
git add actions/profile.ts app/renter/profile/page.tsx app/owner/profile/page.tsx
git commit -m "Add minimal profile pages for setting a delivery/dispatch address"
```

---

## Task 9: PriceSummary delivery-fee row

**Files:**
- Modify: `rental-marketplace/components/renter/price-summary.tsx`

**Interfaces:**
- Consumes: `PriceBreakdown.deliveryFee` from Task 7.
- Produces: `PriceSummary` renders a "Delivery fee" row (only when `pricing.deliveryFee > 0`), between "Service fee" and the tax row.

- [ ] **Step 1: Update the component**

In `rental-marketplace/components/renter/price-summary.tsx`, insert a new row after the "Service fee" row and before the `showTax` block:

```tsx
      <div className="flex justify-between text-sm mb-2.5 text-text-secondary">
        <span>Service fee</span>
        <span>{formatMoney(pricing.serviceFee, currency)}</span>
      </div>
      {pricing.deliveryFee > 0 && (
        <div className="flex justify-between text-sm mb-2.5 text-text-secondary">
          <span>Delivery fee</span>
          <span>{formatMoney(pricing.deliveryFee, currency)}</span>
        </div>
      )}
      {showTax && (
```

- [ ] **Step 2: Verify with a quick manual render check**

There's no existing test file for this presentational component (matching the codebase's existing pattern — no component-level tests elsewhere in `components/`), so verify by eye once Task 10 wires a real delivery quote through the booking page in the browser.

- [ ] **Step 3: Commit**

```bash
cd rental-marketplace
git add components/renter/price-summary.tsx
git commit -m "Show delivery fee row in PriceSummary when present"
```

---

## Task 10: Booking page — pickup-method form, hasAddress gating, live quote

**Files:**
- Create: `rental-marketplace/components/renter/pickup-method-form.tsx`
- Modify: `rental-marketplace/app/renter/listings/[id]/book/page.tsx`

**Interfaces:**
- Consumes: `Owner.hasAddress`, `User.address` (Task 7); `getQuote` with `{ pickupMethod, listingId }` (Task 7); `PriceSummary` (Task 9).
- Produces: booking page shows a live, distance-based delivery quote; delivery is disabled with a link to `/renter/profile` when either party lacks an address.

- [ ] **Step 1: Create the pickup-method client component**

Create `rental-marketplace/components/renter/pickup-method-form.tsx`:

```tsx
"use client";

import Link from "next/link";
import type { ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import type { PickupMethod } from "@/types";

export function PickupMethodForm({
  pickupMethod,
  deliveryDisabled,
  start,
  end,
}: {
  pickupMethod: PickupMethod;
  deliveryDisabled: boolean;
  start: string;
  end: string;
}) {
  function submitForm(e: ChangeEvent<HTMLInputElement>) {
    e.currentTarget.form?.requestSubmit();
  }

  return (
    <form method="get">
      <input type="hidden" name="start" value={start} />
      <input type="hidden" name="end" value={end} />

      <div className="text-md font-semibold mb-3">Pickup method</div>
      <div className="flex gap-3 mb-2">
        <label className="flex-1 has-checked:border-2 has-checked:border-accent has-checked:bg-accent-tint p-3.5 rounded-md border border-border cursor-pointer text-sm font-semibold">
          <input
            type="radio"
            name="pickupMethod"
            value="pickup"
            defaultChecked={pickupMethod === "pickup"}
            onChange={submitForm}
            className="sr-only"
          />
          Pickup from owner
        </label>
        <label
          className={cn(
            "flex-1 has-checked:border-2 has-checked:border-accent has-checked:bg-accent-tint p-3.5 rounded-md border border-border text-sm has-checked:text-text-primary",
            deliveryDisabled
              ? "opacity-50 cursor-not-allowed text-text-muted"
              : "cursor-pointer text-text-muted",
          )}
        >
          <input
            type="radio"
            name="pickupMethod"
            value="delivery"
            defaultChecked={pickupMethod === "delivery"}
            disabled={deliveryDisabled}
            onChange={submitForm}
            className="sr-only"
          />
          Delivery
        </label>
      </div>
      {deliveryDisabled ? (
        <div className="text-xs text-text-muted mb-7">
          <Link href="/renter/profile" className="text-accent underline">
            Add your address
          </Link>{" "}
          to enable delivery.
        </div>
      ) : (
        <div className="mb-7" />
      )}
    </form>
  );
}
```

- [ ] **Step 2: Rewrite the booking page**

Replace `rental-marketplace/app/renter/listings/[id]/book/page.tsx` in full:

```tsx
import { createBookingAction } from "@/actions/booking";
import { PriceSummary } from "@/components/renter/price-summary";
import { PickupMethodForm } from "@/components/renter/pickup-method-form";
import { Button } from "@/components/ui/button";
import { getListingById } from "@/lib/data/listings";
import { chargeCurrency } from "@/lib/currency";
import { formatDateRange, nightsBetween } from "@/lib/format";
import { formatMoney } from "@/lib/pricing";
import { getQuote } from "@/lib/api/pricing";
import type { Metadata } from "next";
import type { PickupMethod } from "@/types";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/users";

export async function generateMetadata({
  params,
}: PageProps<"/renter/listings/[id]/book">): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);
  return { title: listing ? `Book ${listing.title}` : "Request to book" };
}

export default async function BookPage({
  params,
  searchParams,
}: PageProps<"/renter/listings/[id]/book">) {
  const { id } = await params;
  const search = await searchParams;
  const listing = await getListingById(id);

  if (!listing) notFound();

  const currentUser = await getCurrentUser();
  if (currentUser?.id === listing.owner.id) {
    redirect(`/renter/listings/${listing.id}`);
  }

  const currency = chargeCurrency(listing.country);
  const start = typeof search.start === "string" ? search.start : "";
  const end = typeof search.end === "string" ? search.end : "";
  const error = typeof search.error === "string" ? search.error : undefined;
  const nights = start && end && end > start ? nightsBetween(start, end) : 0;
  const dateRangeLabel =
    nights > 0 ? formatDateRange(start, end) : "Select dates";

  const deliveryDisabled = !currentUser?.address || !listing.owner.hasAddress;
  const requestedPickupMethod: PickupMethod =
    search.pickupMethod === "delivery" ? "delivery" : "pickup";
  const pickupMethod: PickupMethod =
    requestedPickupMethod === "delivery" && !deliveryDisabled
      ? "delivery"
      : "pickup";

  const pricing =
    nights > 0
      ? await getQuote(
          listing.pricePerDay,
          nights,
          pickupMethod === "delivery"
            ? { pickupMethod, listingId: listing.id }
            : undefined,
        )
      : {
          nights: 0,
          pricePerDay: listing.pricePerDay,
          subtotal: 0,
          serviceFee: 0,
          deliveryFee: 0,
          tax: 0,
          total: 0,
        };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-7 pb-16">
      <Link
        href={`/renter/listings/${listing.id}`}
        className="block text-sm text-text-secondary mb-[18px]"
      >
        &larr; Back to listing
      </Link>
      <h1 className="text-xl font-bold mb-6">Request to book</h1>

      {error && (
        <div className="flex gap-2 items-start px-3.5 py-3 rounded-md bg-error-tint mb-5">
          <div className="text-sm text-error-tint-text">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
        <div>
          <div className="flex gap-3.5 p-4 border border-border rounded-lg bg-surface mb-6">
            <div className="w-16 h-16 rounded-md flex-shrink-0 bg-surface-alt overflow-hidden">
              {listing.images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div>
              <div className="text-md font-semibold mb-1">{listing.title}</div>
              <div className="text-sm text-text-secondary">
                {dateRangeLabel} &middot; {nights} nights
              </div>
            </div>
          </div>

          <PickupMethodForm
            pickupMethod={pickupMethod}
            deliveryDisabled={deliveryDisabled}
            start={start}
            end={end}
          />
        </div>

        <form
          action={createBookingAction}
          className="border border-border rounded-xl bg-surface p-[22px]"
        >
          <input type="hidden" name="listingId" value={listing.id} />
          <input type="hidden" name="start" value={start} />
          <input type="hidden" name="end" value={end} />
          <input type="hidden" name="pickupMethod" value={pickupMethod} />

          <PriceSummary pricing={pricing} currency={currency} showTax />
          {listing.depositAmount > 0 && (
            <div className="flex justify-between text-xs text-text-muted mb-5">
              <span>Refundable security deposit</span>
              <span>{formatMoney(listing.depositAmount, currency)}</span>
            </div>
          )}
          <Button type="submit" className="w-full mb-3.5" disabled={nights <= 0}>
            Send request
          </Button>
          <div className="flex gap-2 items-start px-3 py-2.5 rounded-md bg-warning-tint">
            <div className="text-xs leading-[17px] text-warning-tint-text">
              This is a request. Your booking is confirmed as soon as the
              owner accepts.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type-check and lint**

Run: `cd rental-marketplace && npm run build && npm run lint`
Expected: both succeed with no errors or warnings. This also confirms the `deliveryFee`-shaped fallback pricing object in this file satisfies `PriceBreakdown` from Task 7.

- [ ] **Step 4: Manual verification in the browser**

Run: `cd rental-marketplace && npm run dev` (ensure `rental-marketplace-api` is also running per its own dev instructions, since this frontend calls it directly)

1. Log in as a renter with no address set. Open a listing's booking page. Confirm the "Delivery" radio is disabled with an "Add your address" link to `/renter/profile`, and the link works and saves an address (submit an address, confirm the "Address saved." banner and that the field is pre-filled on reload).
2. As the listing owner, visit `/owner/profile`, save a dispatch address.
3. Back on the booking page as the renter (now with an address), confirm "Delivery" is selectable. Select it — confirm the page re-renders (URL gains `?pickupMethod=delivery`) and `PriceSummary` shows a nonzero "Delivery fee" row, folded into the total.
4. Switch back to "Pickup from owner" — confirm the delivery fee row disappears and the total drops accordingly.
5. Submit "Send request" with delivery selected — confirm the created booking persists (check `/renter/dashboard` or the booking confirmation page) and its total reflects the delivery fee.

Expected: all five behaviors match; report any mismatch before proceeding to commit.

- [ ] **Step 5: Commit**

```bash
cd rental-marketplace
git add components/renter/pickup-method-form.tsx app/renter/listings/[id]/book/page.tsx
git commit -m "Wire distance-based delivery pricing into the booking page"
```

---

## Post-implementation check

- [ ] Run `cd rental-marketplace-api && npm test` — full backend suite green.
- [ ] Run `cd rental-marketplace-api && npm run lint` — clean.
- [ ] Run `cd rental-marketplace && npm run build && npm run lint` — clean, matching this repo's "Code quality" CLAUDE.md rule (no lint warnings).
