-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "country" CHAR(2) NOT NULL DEFAULT 'ZA';
ALTER TABLE "listings" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_paymentMethodId_fkey";
ALTER TABLE "bookings"
  DROP COLUMN "paymentMethodId",
  DROP COLUMN "paymentIntentId",
  DROP COLUMN "depositIntentId",
  ADD COLUMN "pfPaymentId" TEXT,
  ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'ZAR',
  ADD COLUMN "awaitingPaymentExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_pfPaymentId_key" ON "bookings"("pfPaymentId");

-- CreateIndex
CREATE INDEX "bookings_listingId_status_idx" ON "bookings"("listingId", "status");

-- DropTable
DROP TABLE "payment_methods";

-- DropEnum
DROP TYPE "CardBrand";
