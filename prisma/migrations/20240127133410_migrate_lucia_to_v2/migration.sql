/*
  Warnings:

  - You are about to drop the column `expires` on the `key` table. All the data in the column will be lost.
  - You are about to drop the column `primary` on the `key` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `key` DROP COLUMN `expires`,
    DROP COLUMN `primary`;
