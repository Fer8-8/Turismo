/*
  Warnings:

  - You are about to drop the column `top_catergories` on the `user_features_cache` table. All the data in the column will be lost.
  - Added the required column `top_categories` to the `user_features_cache` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `session_id` on the `user_interactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "place_tags" ADD COLUMN     "tag_id" UUID;

-- AlterTable
ALTER TABLE "user_features_cache" DROP COLUMN "top_catergories",
ADD COLUMN     "top_categories" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "user_interactions" DROP COLUMN "session_id",
ADD COLUMN     "session_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "user_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_tags" ADD CONSTRAINT "place_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
