-- CreateEnum
CREATE TYPE "ListingCategory" AS ENUM ('Cameras', 'PowerTools', 'Bikes', 'CampingGear');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('active', 'paused', 'pending', 'rejected');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('pending', 'paid', 'on_hold');

-- CreateEnum
CREATE TYPE "PickupMethod" AS ENUM ('pickup', 'delivery');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('flagged', 'under_review', 'resolved');

-- CreateEnum
CREATE TYPE "CardBrand" AS ENUM ('Visa', 'Mastercard');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "memberSince" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseTime" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ListingCategory" NOT NULL,
    "location" TEXT NOT NULL,
    "pricePerDay" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "pickupMethod" "PickupMethod" NOT NULL,
    "payoutStatus" "PayoutStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pricePerDayAtBooking" DECIMAL(10,2) NOT NULL,
    "nights" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "serviceFee" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "listingId" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,
    "paymentMethodId" TEXT NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "brand" "CardBrand" NOT NULL,
    "last4" TEXT NOT NULL,
    "expires" TEXT NOT NULL,
    "processorPaymentMethodId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_threads" (
    "id" TEXT NOT NULL,
    "unreadForRenter" BOOLEAN NOT NULL DEFAULT false,
    "unreadForOwner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingId" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,

    CONSTRAINT "message_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "threadId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disputes" (
    "id" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'flagged',
    "detail" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_requestNumber_key" ON "bookings"("requestNumber");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_processorPaymentMethodId_key" ON "payment_methods"("processorPaymentMethodId");

-- CreateIndex
CREATE UNIQUE INDEX "disputes_bookingId_key" ON "disputes"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "message_threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Enforce "no overlapping date ranges per listing" at the DB level for
-- confirmed bookings — this is the source of truth; BookingsService's
-- pre-check only closes the common case and can't fully close the race
-- between two concurrent requests.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_no_overlapping_confirmed"
  EXCLUDE USING gist (
    "listingId" WITH =,
    daterange("startDate", "endDate") WITH &&
  )
  WHERE ("status" = 'confirmed');
