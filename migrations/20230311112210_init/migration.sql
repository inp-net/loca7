-- CreateEnum
CREATE TYPE "AppartmentKind" AS ENUM ('chambre', 'studio', 't1', 't1bis', 't2', 't3etplus', 'colocation');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('dangerous', 'obsolete', 'other');

-- CreateEnum
CREATE TYPE "PublicTransportType" AS ENUM ('bus', 'bhnf', 'metro', 'tram', 'telepherique', 'tad');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "god" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "active_expires" BIGINT NOT NULL,
    "idle_expires" BIGINT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key" (
    "id" TEXT NOT NULL,
    "hashed_password" TEXT,
    "user_id" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL,
    "expires" BIGINT,

    CONSTRAINT "key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appartment" (
    "id" TEXT NOT NULL,
    "rent" INTEGER NOT NULL,
    "charges" INTEGER NOT NULL,
    "deposit" INTEGER NOT NULL,
    "surface" INTEGER NOT NULL,
    "kind" "AppartmentKind" NOT NULL,
    "roomsCount" INTEGER NOT NULL,
    "availableAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "locationId" TEXT,
    "hasFurniture" BOOLEAN,
    "hasParking" BOOLEAN,
    "description" TEXT NOT NULL,
    "travelTimeId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Appartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "appartmentId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("filename")
);

-- CreateTable
CREATE TABLE "GeographicPoint" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GeographicPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appartmentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelTimeToN7" (
    "id" TEXT NOT NULL,
    "byFoot" INTEGER,
    "byBike" INTEGER,
    "byPublicTransport" INTEGER,

    CONSTRAINT "TravelTimeToN7_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicTransportStation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "line" TEXT NOT NULL,
    "type" "PublicTransportType" NOT NULL,
    "color" TEXT,
    "appartmentId" TEXT,

    CONSTRAINT "PublicTransportStation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_id_key" ON "session"("id");

-- CreateIndex
CREATE INDEX "session_user_id_idx" ON "session"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "key_id_key" ON "key"("id");

-- CreateIndex
CREATE INDEX "key_user_id_idx" ON "key"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Appartment_id_key" ON "Appartment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_filename_appartmentId_key" ON "Photo"("filename", "appartmentId");

-- CreateIndex
CREATE UNIQUE INDEX "GeographicPoint_id_key" ON "GeographicPoint"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_id_key" ON "Report"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TravelTimeToN7_id_key" ON "TravelTimeToN7"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PublicTransportStation_id_key" ON "PublicTransportStation"("id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key" ADD CONSTRAINT "key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appartment" ADD CONSTRAINT "Appartment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "GeographicPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appartment" ADD CONSTRAINT "Appartment_travelTimeId_fkey" FOREIGN KEY ("travelTimeId") REFERENCES "TravelTimeToN7"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appartment" ADD CONSTRAINT "Appartment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_appartmentId_fkey" FOREIGN KEY ("appartmentId") REFERENCES "Appartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_appartmentId_fkey" FOREIGN KEY ("appartmentId") REFERENCES "Appartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicTransportStation" ADD CONSTRAINT "PublicTransportStation_appartmentId_fkey" FOREIGN KEY ("appartmentId") REFERENCES "Appartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
