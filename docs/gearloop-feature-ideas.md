# Gearloop — feature ideas & findings

Notes from reading `rental-marketplace`, `rental-marketplace-api`, and `rental-marketplace-admin`. Suggestions only — nothing here is planned or scoped yet.

## What Gearloop is today

P2P equipment rental (cameras, power tools, bikes, camping gear). NestJS + Prisma/Postgres API, one Next 16 app for renter + owner, a separate one for staff.

Working today: auth (user + admin JWT), listings CRUD + approval queue, date-overlap-safe bookings with a pricing snapshot, stored payment methods, per-listing message threads, disputes, user suspend/delete, revenue dashboard.

---

## Tier 1 — the marketplace doesn't really work without these

### 1. Two-way reviews & ratings
There is no `Review` model at all. Trust *is* the product in P2P gear rental — renter rates gear + owner, owner rates renter. Also turns `User.responseTime` from a free-text string the user types about themselves into a computed number.

### 2. Notifications (email + in-app)
Nothing notifies anyone of anything. An owner who doesn't log in never learns a booking request exists. `unreadForRenter` / `unreadForOwner` flags exist on threads with no delivery mechanism behind them. Biggest silent conversion loss in the product.

### 3. Actually charge the card
`PaymentMethod.processorPaymentMethodId` is stored and never used. Auth-hold on request → capture on confirm → release on decline. That, plus a payout job, is what makes `payoutStatus` mean something.

### 4. Security deposit + damage claims
`Dispute` is status + free text with no money attached. Hold a deposit, release on clean return, claim against it with a resolution amount.

### 5. Handoff condition photos
Timestamped photos at pickup and return, from both parties. This is what makes claims in #4 resolvable instead of he-said-she-said, and it prevents most disputes from starting.

---

## Tier 2 — supply and demand quality

### 6. Owner availability blackouts
The schema deliberately dropped `unavailableDaysOfMonth` in favour of deriving availability from confirmed bookings. Correct for bookings, but it left owners no way to block dates for personal use, travel, or repairs. Real functional hole.

### 7. Cancellation policy + refunds
`cancelled` exists as a booking status with no rules, no refund tiers, and no record of who cancelled.

### 8. Real search
Today: category + location substring + date range, unsorted, unbounded. Add keyword search on title/description, price range, sort, pagination, and distance ("within 10 km"). For gear you drive to collect, distance is the primary filter — and `location` being a plain string blocks that.

### 9. Pricing flexibility
One flat `pricePerDay`. Add weekly/monthly discounts, minimum rental days, and a delivery fee — `PickupMethod.delivery` currently costs $0 and collects no address.

### 10. Favorites + saved searches with alerts
Cheap, and the natural re-engagement hook once #2 exists.

---

## Tier 3 — ops and retention

### 11. Admin audit log
Staff can suspend users, delete listings, and resolve disputes with zero record of who did it or why. One table. For a portal touching money and account status this is close to mandatory.

### 12. Booking lifecycle states
`picked_up` / `returned` / `late`, plus renter-initiated extensions. Extending is the most common mid-rental request and today means cancel-and-rebook.

### 13. Verification badges
Email/phone verified, ID checked. Ties into a trusted-renter tier with a reduced deposit.

### 14. Auto-expire pending requests
Pending bookings live forever, and two overlapping pending bookings can coexist by design — so a stale one silently blocks nothing while looking like it does. A 24h expiry plus an owner response SLA fixes both.

### 15. Multi-item bookings
A photographer wants body + lens + tripod from one owner over one date range. That is three separate bookings today.

---

## If picking three to do next

**Notifications** and **reviews** — the two biggest drivers of people coming back.
