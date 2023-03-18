/*
  Warnings:

  - Added the required column `latitude` to the `PublicTransportStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `PublicTransportStation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PublicTransportStation" DROP CONSTRAINT "PublicTransportStation_appartmentId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_appartmentId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_authorId_fkey";

-- AlterTable
ALTER TABLE "PublicTransportStation" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_appartmentId_fkey" FOREIGN KEY ("appartmentId") REFERENCES "Appartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicTransportStation" ADD CONSTRAINT "PublicTransportStation_appartmentId_fkey" FOREIGN KEY ("appartmentId") REFERENCES "Appartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
