-- Remove the payment processor: an owner accepting a booking now confirms it
-- directly, so `awaiting_payment` and its supporting columns no longer mean
-- anything. Backfill first so no row is left in a state about to disappear.

-- Any booking still parked awaiting a payment that will never come is
-- treated as accepted — the owner already said yes, and there's no
-- processor left to collect payment through.
UPDATE "bookings" SET "status" = 'confirmed' WHERE "status" = 'awaiting_payment';

-- The "payment required" notification described a flow that no longer
-- exists.
DELETE FROM "notifications" WHERE "type" = 'payment_required';

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_pfPaymentId_key";
DROP INDEX IF EXISTS "bookings_pfPaymentId_key";
ALTER TABLE "bookings"
  DROP COLUMN "pfPaymentId",
  DROP COLUMN "payoutStatus",
  DROP COLUMN "awaitingPaymentExpiresAt";

-- DropEnum
DROP TYPE "PayoutStatus";

-- The no-overlap EXCLUDE constraint's WHERE clause embeds a literal
-- comparison against the old enum type, so it has to come off before the
-- type swap and go back on after.
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_no_overlapping_confirmed";

-- Recreate BookingStatus without awaiting_payment (Postgres can't drop an
-- enum value in place).
CREATE TYPE "BookingStatus_new" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
ALTER TABLE "bookings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'pending';
DROP TYPE "BookingStatus";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_no_overlapping_confirmed"
  EXCLUDE USING gist (
    "listingId" WITH =,
    daterange("startDate", "endDate") WITH &&
  )
  WHERE ("status" = 'confirmed');

-- Recreate NotificationType without payment_required.
CREATE TYPE "NotificationType_new" AS ENUM (
  'booking_requested',
  'booking_confirmed',
  'booking_cancelled',
  'message_received',
  'dispute_filed',
  'dispute_resolved',
  'deposit_released'
);
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
DROP TYPE "NotificationType";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
