-- CreateEnum
CREATE TYPE "HandoffStage" AS ENUM ('pickup', 'returned');

-- CreateTable
CREATE TABLE "handoff_photos" (
    "id" TEXT NOT NULL,
    "stage" "HandoffStage" NOT NULL,
    "url" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookingId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,

    CONSTRAINT "handoff_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "handoff_photos_bookingId_createdAt_idx" ON "handoff_photos"("bookingId", "createdAt");

-- AddForeignKey
ALTER TABLE "handoff_photos" ADD CONSTRAINT "handoff_photos_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "handoff_photos" ADD CONSTRAINT "handoff_photos_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
