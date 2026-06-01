/*
  Warnings:

  - You are about to drop the column `event_id` on the `activities_planner` table. All the data in the column will be lost.
  - You are about to drop the column `place_id` on the `activities_planner` table. All the data in the column will be lost.
  - You are about to drop the column `planner_id` on the `activities_planner` table. All the data in the column will be lost.
  - You are about to drop the column `social_network` on the `contact_details` table. All the data in the column will be lost.
  - You are about to drop the `Reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visit_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wishlist` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_user]` on the table `preferences` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_language]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_currency]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_planner` to the `activities_planner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `social_media` to the `contact_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abbr` to the `currencies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abbr` to the `languages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `planner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `planner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `preferences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_currency` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_language` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "routes_status" AS ENUM ('confirmed', 'in_progress', 'completed');

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_place_id_fkey";

-- DropForeignKey
ALTER TABLE "activities_planner" DROP CONSTRAINT "activities_planner_event_id_fkey";

-- DropForeignKey
ALTER TABLE "activities_planner" DROP CONSTRAINT "activities_planner_place_id_fkey";

-- DropForeignKey
ALTER TABLE "activities_planner" DROP CONSTRAINT "activities_planner_planner_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_contactDetails_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_state_id_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_place_id_fkey";

-- DropForeignKey
ALTER TABLE "visit_history" DROP CONSTRAINT "visit_history_event_id_fkey";

-- DropForeignKey
ALTER TABLE "visit_history" DROP CONSTRAINT "visit_history_place_id_fkey";

-- DropForeignKey
ALTER TABLE "visit_history" DROP CONSTRAINT "visit_history_state_id_fkey";

-- DropForeignKey
ALTER TABLE "wishlist" DROP CONSTRAINT "wishlist_event_id_fkey";

-- DropForeignKey
ALTER TABLE "wishlist" DROP CONSTRAINT "wishlist_place_id_fkey";

-- AlterTable
ALTER TABLE "activities_planner" DROP COLUMN "event_id",
DROP COLUMN "place_id",
DROP COLUMN "planner_id",
ADD COLUMN     "id_planner" UUID NOT NULL;

-- AlterTable
ALTER TABLE "contact_details" DROP COLUMN "social_network",
ADD COLUMN     "social_media" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "currencies" ADD COLUMN     "abbr" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "languages" ADD COLUMN     "abbr" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "planner" ADD COLUMN     "status" "routes_status" NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "preferences" ADD COLUMN     "id_user" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "id_currency" UUID NOT NULL,
ADD COLUMN     "id_language" UUID NOT NULL;

-- DropTable
DROP TABLE "Reviews";

-- DropTable
DROP TABLE "events";

-- DropTable
DROP TABLE "images";

-- DropTable
DROP TABLE "visit_history";

-- DropTable
DROP TABLE "wishlist";

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "card_number_hashed" TEXT NOT NULL,
    "expiry_date_hashed" TEXT NOT NULL,
    "cvc_hashed" TEXT NOT NULL,
    "name_card" TEXT NOT NULL,
    "surname_card" TEXT NOT NULL,
    "cardtype" TEXT NOT NULL,
    "last_4" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" TEXT NOT NULL,
    "rate" TEXT NOT NULL,
    "date_of_visit" TIMESTAMP(3) NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_place" UUID NOT NULL,
    "id_event" UUID NOT NULL,
    "id_state" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_user" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "id_state" UUID NOT NULL,
    "details" JSONB NOT NULL,
    "contactDetails_id" UUID NOT NULL,
    "isTradition" BOOLEAN NOT NULL,
    "languages_details" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "alt_text" TEXT NOT NULL,
    "isCover" BOOLEAN NOT NULL,
    "event_id" UUID NOT NULL,
    "place_id" UUID NOT NULL,
    "review_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "size" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Activities_plannerToPlaces" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_Activities_plannerToPlaces_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_Activities_plannerToEvents" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_Activities_plannerToEvents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FavoritesToPlaces" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_FavoritesToPlaces_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventsToStates" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_EventsToStates_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventsToFavorites" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_EventsToFavorites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Activities_plannerToPlaces_B_index" ON "_Activities_plannerToPlaces"("B");

-- CreateIndex
CREATE INDEX "_Activities_plannerToEvents_B_index" ON "_Activities_plannerToEvents"("B");

-- CreateIndex
CREATE INDEX "_FavoritesToPlaces_B_index" ON "_FavoritesToPlaces"("B");

-- CreateIndex
CREATE INDEX "_EventsToStates_B_index" ON "_EventsToStates"("B");

-- CreateIndex
CREATE INDEX "_EventsToFavorites_B_index" ON "_EventsToFavorites"("B");

-- CreateIndex
CREATE UNIQUE INDEX "preferences_id_user_key" ON "preferences"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_language_key" ON "user"("id_language");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_currency_key" ON "user"("id_currency");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferences" ADD CONSTRAINT "preferences_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_id_place_fkey" FOREIGN KEY ("id_place") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_id_event_fkey" FOREIGN KEY ("id_event") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_id_state_fkey" FOREIGN KEY ("id_state") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planner" ADD CONSTRAINT "planner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities_planner" ADD CONSTRAINT "activities_planner_id_planner_fkey" FOREIGN KEY ("id_planner") REFERENCES "planner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_contactDetails_id_fkey" FOREIGN KEY ("contactDetails_id") REFERENCES "contact_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_language_fkey" FOREIGN KEY ("id_language") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_currency_fkey" FOREIGN KEY ("id_currency") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Activities_plannerToPlaces" ADD CONSTRAINT "_Activities_plannerToPlaces_A_fkey" FOREIGN KEY ("A") REFERENCES "activities_planner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Activities_plannerToPlaces" ADD CONSTRAINT "_Activities_plannerToPlaces_B_fkey" FOREIGN KEY ("B") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Activities_plannerToEvents" ADD CONSTRAINT "_Activities_plannerToEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "activities_planner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Activities_plannerToEvents" ADD CONSTRAINT "_Activities_plannerToEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoritesToPlaces" ADD CONSTRAINT "_FavoritesToPlaces_A_fkey" FOREIGN KEY ("A") REFERENCES "Favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoritesToPlaces" ADD CONSTRAINT "_FavoritesToPlaces_B_fkey" FOREIGN KEY ("B") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsToStates" ADD CONSTRAINT "_EventsToStates_A_fkey" FOREIGN KEY ("A") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsToStates" ADD CONSTRAINT "_EventsToStates_B_fkey" FOREIGN KEY ("B") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsToFavorites" ADD CONSTRAINT "_EventsToFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsToFavorites" ADD CONSTRAINT "_EventsToFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "Favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
