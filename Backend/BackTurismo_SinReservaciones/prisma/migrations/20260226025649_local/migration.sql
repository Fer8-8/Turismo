/*
  Warnings:

  - You are about to drop the column `coordinates` on the `places` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "places" DROP COLUMN "coordinates";

-- CreateIndex
CREATE INDEX "place_attributes_latitude_idx" ON "place_attributes"("latitude");

-- CreateIndex
CREATE INDEX "place_attributes_longitude_idx" ON "place_attributes"("longitude");
