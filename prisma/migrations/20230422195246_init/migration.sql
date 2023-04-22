-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    `lastName` VARCHAR(191) NOT NULL DEFAULT '',
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT false,
    `god` BOOLEAN NOT NULL DEFAULT false,
    `emailIsValidated` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `agencyName` VARCHAR(191) NOT NULL DEFAULT '',
    `agencyWebsite` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `user_id_key`(`id`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `active_expires` BIGINT NOT NULL,
    `idle_expires` BIGINT NOT NULL,

    UNIQUE INDEX `session_id_key`(`id`),
    INDEX `session_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailValidation` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires` BIGINT NOT NULL,

    UNIQUE INDEX `EmailValidation_id_key`(`id`),
    INDEX `EmailValidation_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordReset` (
    `id` VARCHAR(191) NOT NULL,
    `expires` BIGINT NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PasswordReset_id_key`(`id`),
    INDEX `PasswordReset_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `key` (
    `id` VARCHAR(191) NOT NULL,
    `hashed_password` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `primary` BOOLEAN NOT NULL,
    `expires` BIGINT NULL,

    UNIQUE INDEX `key_id_key`(`id`),
    INDEX `key_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appartment` (
    `id` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL AUTO_INCREMENT,
    `rent` INTEGER NOT NULL,
    `charges` INTEGER NOT NULL DEFAULT 0,
    `deposit` INTEGER NOT NULL DEFAULT 0,
    `surface` INTEGER NOT NULL,
    `kind` ENUM('chambre', 'studio', 't1', 't1bis', 't2', 't3etplus', 'colocation', 'autre') NOT NULL,
    `roomsCount` INTEGER NOT NULL,
    `availableAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `hasFurniture` BOOLEAN NULL,
    `hasParking` BOOLEAN NULL,
    `hasBicycleParking` BOOLEAN NULL,
    `hasFiberInternet` BOOLEAN NULL,
    `hasElevator` BOOLEAN NULL,
    `description` TEXT NOT NULL,
    `travelTimeId` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `createdByAdmin` BOOLEAN NOT NULL DEFAULT false,
    `approved` BOOLEAN NOT NULL DEFAULT false,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `importedFromOldSite` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Appartment_id_key`(`id`),
    UNIQUE INDEX `Appartment_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Photo` (
    `id` VARCHAR(191) NOT NULL,
    `filename` TINYTEXT NOT NULL,
    `contentType` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `hash` VARCHAR(191) NULL,
    `appartmentId` VARCHAR(191) NULL,
    `appartmentEditId` VARCHAR(191) NULL,

    UNIQUE INDEX `Photo_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AppartmentEdit` (
    `id` VARCHAR(191) NOT NULL,
    `rent` INTEGER NOT NULL,
    `charges` INTEGER NOT NULL,
    `deposit` INTEGER NOT NULL,
    `surface` INTEGER NOT NULL,
    `kind` ENUM('chambre', 'studio', 't1', 't1bis', 't2', 't3etplus', 'colocation', 'autre') NOT NULL,
    `roomsCount` INTEGER NOT NULL,
    `availableAt` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `hasFurniture` BOOLEAN NULL,
    `hasParking` BOOLEAN NULL,
    `hasBicycleParking` BOOLEAN NULL,
    `hasFiberInternet` BOOLEAN NULL,
    `hasElevator` BOOLEAN NULL,
    `description` TEXT NOT NULL,
    `applied` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `appliedAt` DATETIME(3) NULL,
    `appartmentId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AppartmentEdit_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `id` VARCHAR(191) NOT NULL,
    `reason` ENUM('dangerous', 'obsolete', 'other') NOT NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `appartmentId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NULL,

    UNIQUE INDEX `Report_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TravelTimeToN7` (
    `id` VARCHAR(191) NOT NULL,
    `byFoot` INTEGER NULL,
    `byBike` INTEGER NULL,
    `byPublicTransport` INTEGER NULL,

    UNIQUE INDEX `TravelTimeToN7_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PublicTransportStation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `line` VARCHAR(191) NOT NULL,
    `type` ENUM('bus', 'bhnf', 'metro', 'tram', 'telepherique', 'tad') NOT NULL,
    `color` VARCHAR(191) NULL,
    `appartmentId` VARCHAR(191) NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    UNIQUE INDEX `PublicTransportStation_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailValidation` ADD CONSTRAINT `EmailValidation_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordReset` ADD CONSTRAINT `PasswordReset_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `key` ADD CONSTRAINT `key_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appartment` ADD CONSTRAINT `Appartment_travelTimeId_fkey` FOREIGN KEY (`travelTimeId`) REFERENCES `TravelTimeToN7`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appartment` ADD CONSTRAINT `Appartment_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_appartmentId_fkey` FOREIGN KEY (`appartmentId`) REFERENCES `Appartment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_appartmentEditId_fkey` FOREIGN KEY (`appartmentEditId`) REFERENCES `AppartmentEdit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AppartmentEdit` ADD CONSTRAINT `AppartmentEdit_appartmentId_fkey` FOREIGN KEY (`appartmentId`) REFERENCES `Appartment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_appartmentId_fkey` FOREIGN KEY (`appartmentId`) REFERENCES `Appartment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PublicTransportStation` ADD CONSTRAINT `PublicTransportStation_appartmentId_fkey` FOREIGN KEY (`appartmentId`) REFERENCES `Appartment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
