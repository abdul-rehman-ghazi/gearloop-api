-- CreateTable
CREATE TABLE "blackouts" (
    "id" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "blackouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "blackouts_listingId_startDate_idx" ON "blackouts"("listingId", "startDate");

-- AddForeignKey
ALTER TABLE "blackouts" ADD CONSTRAINT "blackouts_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
