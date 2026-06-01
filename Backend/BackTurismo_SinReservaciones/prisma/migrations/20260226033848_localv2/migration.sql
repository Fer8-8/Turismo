/*
  Warnings:

  - You are about to drop the column `latitude` on the `place_attributes` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `place_attributes` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `places` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `places` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "place_attributes_latitude_idx";

-- DropIndex
DROP INDEX "place_attributes_longitude_idx";

-- AlterTable
ALTER TABLE "place_attributes" DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "places" ADD COLUMN     "latitude" DECIMAL NOT NULL,
ADD COLUMN     "longitude" DECIMAL NOT NULL;

-- CreateIndex
CREATE INDEX "places_latitude_idx" ON "places"("latitude");

-- CreateIndex
CREATE INDEX "places_longitude_idx" ON "places"("longitude");
