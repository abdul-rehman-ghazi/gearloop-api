-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "lat" DECIMAL(9,6),
ADD COLUMN     "lng" DECIMAL(9,6);
