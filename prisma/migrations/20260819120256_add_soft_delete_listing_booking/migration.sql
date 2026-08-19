-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "deletedAt" TIMESTAMP(3);
