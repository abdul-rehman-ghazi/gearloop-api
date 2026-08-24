-- CreateEnum
CREATE TYPE "CancellationPolicy" AS ENUM ('flexible', 'moderate', 'strict');

-- CreateEnum
CREATE TYPE "CancelledBy" AS ENUM ('renter', 'owner');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" "CancelledBy",
ADD COLUMN     "refundAmount" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "cancellationPolicy" "CancellationPolicy" NOT NULL DEFAULT 'moderate';
