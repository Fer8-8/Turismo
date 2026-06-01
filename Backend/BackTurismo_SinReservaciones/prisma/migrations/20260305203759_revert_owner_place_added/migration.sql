/*
  Warnings:

  - You are about to drop the column `id_user` on the `places` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "places" DROP CONSTRAINT "places_id_user_fkey";

-- AlterTable
ALTER TABLE "places" DROP COLUMN "id_user";
