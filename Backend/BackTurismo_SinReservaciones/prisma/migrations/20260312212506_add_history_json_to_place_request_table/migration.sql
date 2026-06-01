/*
  Warnings:

  - Added the required column `updated_at` to the `place_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "place_request" ADD COLUMN     "history_json" JSONB DEFAULT '[]',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
