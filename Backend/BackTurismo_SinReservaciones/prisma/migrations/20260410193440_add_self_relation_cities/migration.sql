/*
  Warnings:

  - The `size` column on the `media` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "media" ADD COLUMN     "miniature_url" TEXT,
ADD COLUMN     "stream_url" TEXT,
DROP COLUMN "size",
ADD COLUMN     "size" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "places" ADD COLUMN     "city_id" UUID,
ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "states" ADD COLUMN     "description" TEXT DEFAULT '';

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;
