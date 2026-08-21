-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('held', 'released', 'claimed', 'partially_claimed');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'deposit_released';

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "depositAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "depositIntentId" TEXT,
ADD COLUMN     "depositStatus" "DepositStatus";

-- AlterTable
ALTER TABLE "disputes" ADD COLUMN     "claimAmount" DECIMAL(10,2),
ADD COLUMN     "resolvedAmount" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "depositAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;
