/*
  Warnings:

  - A unique constraint covering the columns `[userId,appartmentId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Like_userId_appartmentId_key` ON `Like`(`userId`, `appartmentId`);
