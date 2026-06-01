-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_contactDetails_id_fkey";

-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_id_user_fkey";

-- DropForeignKey
ALTER TABLE "activities_planner" DROP CONSTRAINT "activities_planner_id_planner_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_event_id_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_place_id_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_review_id_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_user_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "places" DROP CONSTRAINT "places_contactDetails_id_fkey";

-- DropForeignKey
ALTER TABLE "places" DROP CONSTRAINT "places_id_category_fkey";

-- DropForeignKey
ALTER TABLE "places" DROP CONSTRAINT "places_state_id_fkey";

-- DropForeignKey
ALTER TABLE "planner" DROP CONSTRAINT "planner_state_id_fkey";

-- DropForeignKey
ALTER TABLE "planner" DROP CONSTRAINT "planner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "preferences" DROP CONSTRAINT "preferences_id_user_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_id_event_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_id_place_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_id_state_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_id_user_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_id_currency_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_id_language_fkey";

-- AlterTable
ALTER TABLE "Events" ALTER COLUMN "id_state" DROP NOT NULL,
ALTER COLUMN "contactDetails_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Favorites" ALTER COLUMN "id_user" DROP NOT NULL;

-- AlterTable
ALTER TABLE "account" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "activities_planner" ALTER COLUMN "id_planner" DROP NOT NULL;

-- AlterTable
ALTER TABLE "media" ALTER COLUMN "event_id" DROP NOT NULL,
ALTER COLUMN "place_id" DROP NOT NULL,
ALTER COLUMN "review_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "places" ALTER COLUMN "id_category" DROP NOT NULL,
ALTER COLUMN "contactDetails_id" DROP NOT NULL,
ALTER COLUMN "state_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "planner" ALTER COLUMN "state_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "preferences" ALTER COLUMN "id_user" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "id_user" DROP NOT NULL,
ALTER COLUMN "id_place" DROP NOT NULL,
ALTER COLUMN "id_event" DROP NOT NULL,
ALTER COLUMN "id_state" DROP NOT NULL;

-- AlterTable
ALTER TABLE "session" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "id_currency" DROP NOT NULL,
ALTER COLUMN "id_language" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferences" ADD CONSTRAINT "preferences_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "categories"("id_category") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_contactDetails_id_fkey" FOREIGN KEY ("contactDetails_id") REFERENCES "contact_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_id_place_fkey" FOREIGN KEY ("id_place") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_id_event_fkey" FOREIGN KEY ("id_event") REFERENCES "Events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_id_state_fkey" FOREIGN KEY ("id_state") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planner" ADD CONSTRAINT "planner_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planner" ADD CONSTRAINT "planner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities_planner" ADD CONSTRAINT "activities_planner_id_planner_fkey" FOREIGN KEY ("id_planner") REFERENCES "planner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_contactDetails_id_fkey" FOREIGN KEY ("contactDetails_id") REFERENCES "contact_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_language_fkey" FOREIGN KEY ("id_language") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_currency_fkey" FOREIGN KEY ("id_currency") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
