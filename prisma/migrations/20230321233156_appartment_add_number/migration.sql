/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Appartment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Appartment" ADD COLUMN     "number" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Appartment_number_key" ON "Appartment"("number");
