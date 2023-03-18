/*
  Warnings:

  - You are about to drop the `GeographicPoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appartment" DROP CONSTRAINT "Appartment_locationId_fkey";

-- AlterTable
ALTER TABLE "Appartment" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- DropTable
DROP TABLE "GeographicPoint";
