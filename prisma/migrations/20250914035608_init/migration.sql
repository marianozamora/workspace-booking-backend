-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "espacios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "espacios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bookings_spaceId_date_idx" ON "bookings"("spaceId", "date");

-- CreateIndex
CREATE INDEX "bookings_clientEmail_idx" ON "bookings"("clientEmail");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "espacios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
