/*
  Warnings:

  - You are about to drop the column `locationId` on the `Appartment` table. All the data in the column will be lost.
  - The primary key for the `Photo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Photo` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Photo` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_appartmentId_fkey";

-- DropIndex
DROP INDEX "Photo_filename_appartmentId_key";

-- AlterTable
ALTER TABLE "Appartment" DROP COLUMN "locationId";

-- AlterTable
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_pkey",
ADD COLUMN     "appartmentEditId" TEXT,
ADD COLUMN     "hash" TEXT,
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "appartmentId" DROP NOT NULL,
ADD CONSTRAINT "Photo_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "AppartmentEdit" (
    "id" TEXT NOT NULL,
    "rent" INTEGER NOT NULL,
    "charges" INTEGER NOT NULL,
    "deposit" INTEGER NOT NULL,
    "surface" INTEGER NOT NULL,
    "kind" "AppartmentKind" NOT NULL,
    "roomsCount" INTEGER NOT NULL,
    "availableAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "hasFurniture" BOOLEAN,
    "hasParking" BOOLEAN,
    "description" TEXT NOT NULL,
    "applied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appliedAt" TIMESTAMP(3),
    "appartmentId" TEXT NOT NULL,

    CONSTRAINT "AppartmentEdit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppartmentEdit_id_key" ON "AppartmentEdit"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_id_key" ON "Photo"("id");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_appartmentId_fkey" FOREIGN KEY ("appartmentId") REFERENCES "Appartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_appartmentEditId_fkey" FOREIGN KEY ("appartmentEditId") REFERENCES "AppartmentEdit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppartmentEdit" ADD CONSTRAINT "AppartmentEdit_appartmentId_fkey" FOREIGN KEY ("appartmentId") REFERENCES "Appartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
