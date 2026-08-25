# Location-based delivery pricing

Status: approved, not yet implemented
Repos touched: `rental-marketplace-api` (schema, pricing, bookings), `rental-marketplace` (profile pages, booking page)

## Problem

The renter booking page (`rental-marketplace/app/renter/listings/[id]/book/page.tsx`) offers a
"Delivery (+$15)" pickup option. The $15 is a hardcoded JSX string — it isn't part of the
`/pricing/quote` response, isn't sent to `createBookingAction`, and isn't stored on the booking.
It's disconnected from pricing entirely. Delivery should cost more the farther the renter is from
the listing's owner.

## Data model

Neither `User` nor `Listing` has any location beyond `Listing.country` (an ISO alpha-2 code used
only for currency). Distance pricing needs real coordinates for both the renter and the owner.

Add to `User` (`prisma/schema.prisma`):

```prisma
address String?
lat     Decimal? @db.Decimal(9, 6)
lng     Decimal? @db.Decimal(9, 6)
```

One address per account. It's reused for both directions — the same field is the renter's
delivery point when they're booking, and the owner's dispatch point when they're the one who
listed the item. No separate per-listing address; an owner with several listings sets their
address once.

Add to `Booking`, alongside the existing pricing snapshot columns (`subtotal`, `serviceFee`,
`tax`, `total`):

```prisma
deliveryFee Decimal @default(0) @db.Decimal(10, 2)
```

Snapshotted like the other pricing fields, for the same reason documented on
`pricePerDayAtBooking`: a later address change or rate-constant tweak must not retroactively
change a past booking's receipt.

Migration: standard Prisma migration, both columns nullable/defaulted so it's backward compatible
with existing rows.

## Geocoding

New `GeocodingService` (`src/common/geocoding.ts`), used only at profile-save time (not on the
hot path of booking or pricing requests):

- Calls Nominatim's public search endpoint
  (`https://nominatim.openstreetmap.org/search?q=<address>&format=json&limit=1`).
- Sends a descriptive `User-Agent` header, per Nominatim's usage policy (required for the public
  instance; no API key).
- No result, or a network/parse failure → throw `BadRequestException('Address not found')`. The
  profile update is rejected; `address`/`lat`/`lng` are only written together, atomically, on a
  successful geocode.
- ponytail: single public Nominatim instance, no caching, no retry/backoff. Fine for save-time-only
  calls at this scale; move to a paid provider or add caching if profile-address-edit volume ever
  makes Nominatim's fair-use rate limit (1 req/sec) a problem.

## Profile endpoint

Extend the users module with:

```
PATCH /users/me/address
body: { address: string }
```

Auth required (existing bearer-token guard). Calls `GeocodingService`, then updates
`address`/`lat`/`lng` on the caller's `User` row. Returns the updated profile (address string only
— never lat/lng, see below).

`GET /users/me` (or wherever the current user/profile is already returned) gains
`address: string | null` on the response so the frontend profile page can show the current value.
Raw `lat`/`lng` are never serialized to any API response — they're only read internally by the
pricing/booking code. Any endpoint that returns a *listing owner* (e.g. `GET /listings/:id`) gains
`hasAddress: boolean` on the owner sub-object instead of the address itself, so a renter can tell
whether delivery is possible without seeing the owner's home address.

## Pricing

New `src/bookings/delivery-pricing.util.ts`:

```ts
export const DELIVERY_BASE_FEE = 5;      // flat component
export const DELIVERY_RATE_PER_KM = 0.5; // scales with distance
export const DELIVERY_MAX_FEE = 50;      // cap

export function haversineKm(a: {lat: number; lng: number}, b: {lat: number; lng: number}): number
export function deliveryFeeForDistance(km: number): number // base + rate*km, clamped to max
```

Pure functions, stdlib `Math` only (no new dependency). Same currency-agnostic convention as
`SERVICE_FEE_RATE`/`TAX_RATE` today — the app doesn't do FX conversion anywhere, amounts are in
the listing's own currency.

`QuoteDto` (`src/pricing/dto/quote.dto.ts`) gains:

```ts
pickupMethod?: 'pickup' | 'delivery' // default 'pickup'
listingId?: string                   // required when pickupMethod === 'delivery'
```

`PricingController#quote`: when `pickupMethod === 'delivery'`, loads the listing (for its owner's
coordinates) and the authenticated caller's coordinates (from the request's user, same as other
authenticated endpoints), computes `deliveryFee` via the util above, and includes it in the
response and in `total`. Missing coordinates on either side → `BadRequestException` — a client
cannot obtain delivery pricing without both addresses being set, which also means it can't be
spoofed by a client that skips the disabled-radio UI.

`BookingsService.create`: when `dto.pickupMethod === 'delivery'`, recomputes `deliveryFee`
server-side the identical way (never trusts a client-submitted amount, matching how
`pricePerDay`/`subtotal`/etc. are already always recomputed from the listing, not the request
body). Adds it into `total` and stores it on the created `Booking` row.

## Frontend (`rental-marketplace`)

**Profile pages** — new, minimal, one per flow since each flow has its own layout/URL prefix per
this repo's convention:
- `app/renter/profile/page.tsx`
- `app/owner/profile/page.tsx`

Each is a thin Server Component wrapping one client form component (address input + save button)
that posts to a new server action (`actions/profile.ts` — `updateAddressAction`), which calls the
new `PATCH /users/me/address`. No other profile fields — just what this feature needs.

**Booking page** (`app/renter/listings/[id]/book/page.tsx`):
- `Owner` type gains `hasAddress: boolean`; `getCurrentUser()`'s return type gains the same.
- Delivery radio is disabled (`disabled` attribute + muted styling, consistent with the existing
  `has-checked` pattern already in this file) when `!currentUser.hasAddress ||
  !listing.owner.hasAddress`, with helper copy: "Add your address to enable delivery" linking to
  `/renter/profile`.
- Pickup method becomes a query param, same mechanism as the existing `start`/`end` searchParams —
  selecting a radio submits a GET to the same URL with `pickupMethod` set, and the server component
  re-renders with the recalculated quote. No client-side price recalculation logic; the page stays
  a Server Component per this repo's architecture principle.
- `lib/api/pricing.ts#getQuote` gains optional `{ pickupMethod, listingId }` params, forwarded as
  query params to `/pricing/quote`.
- `PriceBreakdown` type gains `deliveryFee: number`; `PriceSummary` component renders it as an
  extra row (only when non-zero) between service fee and tax, matching the existing row style.
- `createBookingAction` already forwards `pickupMethod` — no change needed there beyond the
  backend now actually pricing it.

## Error handling

- Geocode failure on profile save: 400 with a message the profile form displays inline ("We
  couldn't find that address — try being more specific").
- Missing coordinates at quote/booking time: 400, surfaced on the booking page as the existing
  `error` searchParam banner (same path already used for other booking failures).
- A renter who deep-links `?pickupMethod=delivery` without an address set gets the same 400 →
  existing error banner, not a crash — the disabled radio is a UX nicety, not the only guard.

## Testing

- `delivery-pricing.util.spec.ts`: `haversineKm` against a couple of known city-pair distances
  (tolerance-based assertion), `deliveryFeeForDistance` for the base/scale/cap boundaries.
- `pricing.controller.spec.ts`: add a delivery-branch case (has addresses → fee present; missing
  address → 400), following the existing spec's structure.
- `bookings.service.spec.ts`: one case booking with `pickupMethod: 'delivery'` produces a
  `deliveryFee` on the created row and in `total`.

## Out of scope

- Cross-country delivery restrictions — dropped once addresses became real coordinates instead of
  a country-scoped city picker; distance is computed regardless of country.
- Per-listing addresses (an owner with multiple locations) — one address per owner account only.
- Caching/rate-limiting the geocoding call, retry logic, or a paid geocoding provider.
- Any other profile fields beyond address (name/photo/etc. already exist elsewhere or aren't
  needed for this feature).
