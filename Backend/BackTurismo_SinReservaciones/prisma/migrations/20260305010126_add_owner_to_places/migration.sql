/*
  Warnings:

  - A unique constraint covering the columns `[id_user]` on the table `places` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'partner';

-- AlterTable
ALTER TABLE "places" ADD COLUMN     "id_user" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "places_id_user_key" ON "places"("id_user");

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
