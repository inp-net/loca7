-- AlterTable
ALTER TABLE "user" ADD COLUMN     "emailIsValidated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EmailValidation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" BIGINT NOT NULL,

    CONSTRAINT "EmailValidation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailValidation_id_key" ON "EmailValidation"("id");

-- CreateIndex
CREATE INDEX "EmailValidation_user_id_idx" ON "EmailValidation"("user_id");

-- AddForeignKey
ALTER TABLE "EmailValidation" ADD CONSTRAINT "EmailValidation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
