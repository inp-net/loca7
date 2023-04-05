-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_appartmentEditId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_appartmentId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "name" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_appartmentId_fkey" FOREIGN KEY ("appartmentId") REFERENCES "Appartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_appartmentEditId_fkey" FOREIGN KEY ("appartmentEditId") REFERENCES "AppartmentEdit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
