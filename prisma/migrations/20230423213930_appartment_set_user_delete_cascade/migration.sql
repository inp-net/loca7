-- DropForeignKey
ALTER TABLE `Appartment` DROP FOREIGN KEY `Appartment_ownerId_fkey`;

-- AddForeignKey
ALTER TABLE `Appartment` ADD CONSTRAINT `Appartment_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
