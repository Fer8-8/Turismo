/*
  Warnings:

  - You are about to drop the column `id_place` on the `contact_details` table. All the data in the column will be lost.
  - You are about to drop the column `id_place` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `preferences` table. All the data in the column will be lost.
  - You are about to drop the column `id_atraccion` on the `visit_history` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `visit_history` table. All the data in the column will be lost.
  - You are about to drop the column `id_place` on the `wishlist` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `wishlist` table. All the data in the column will be lost.
  - You are about to drop the `_PlaceToRoute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `routes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `category` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `contact_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `contact_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `social_network` on table `contact_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `contact_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `contact_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `currencies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `currencies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `currencies` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `place_id` to the `images` table without a default value. This is not possible if the table is not empty.
  - Made the column `url` on table `images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `languages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `languages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `languages` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `contactDetails_id` to the `places` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languages_details` to the `places` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state_id` to the `places` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coordinates` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_category` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `details` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `places` required. This step will fail if there are existing NULL values in that column.
  - Made the column `preferences` on table `preferences` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `preferences` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `preferences` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `region` to the `states` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `states` required. This step will fail if there are existing NULL values in that column.
  - Made the column `extension` on table `states` required. This step will fail if there are existing NULL values in that column.
  - Made the column `population` on table `states` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `states` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `states` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `event_id` to the `visit_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_id` to the `visit_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state_id` to the `visit_history` table without a default value. This is not possible if the table is not empty.
  - Made the column `date_visit` on table `visit_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `images` on table `visit_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `visit_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `visit_history` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `event_id` to the `wishlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_id` to the `wishlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `wishlist` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `wishlist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `wishlist` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "regions" AS ENUM ('Norte', 'Centro', 'Pacifico', 'Bajio', 'Caribe');

-- DropForeignKey
ALTER TABLE "_PlaceToRoute" DROP CONSTRAINT "_PlaceToRoute_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlaceToRoute" DROP CONSTRAINT "_PlaceToRoute_B_fkey";

-- DropForeignKey
ALTER TABLE "contact_details" DROP CONSTRAINT "contact_details_id_place_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_id_place_fkey";

-- DropForeignKey
ALTER TABLE "places" DROP CONSTRAINT "places_id_category_fkey";

-- DropForeignKey
ALTER TABLE "places" DROP CONSTRAINT "places_state_fkey";

-- DropForeignKey
ALTER TABLE "preferences" DROP CONSTRAINT "preferences_id_user_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_id_place_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_id_user_fkey";

-- DropForeignKey
ALTER TABLE "routes" DROP CONSTRAINT "routes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_language_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_preferred_currency_fkey";

-- DropForeignKey
ALTER TABLE "visit_history" DROP CONSTRAINT "visit_history_id_atraccion_fkey";

-- DropForeignKey
ALTER TABLE "visit_history" DROP CONSTRAINT "visit_history_id_user_fkey";

-- DropForeignKey
ALTER TABLE "wishlist" DROP CONSTRAINT "wishlist_id_user_fkey";

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "contact_details" DROP COLUMN "id_place",
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone_number" SET NOT NULL,
ALTER COLUMN "social_network" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "currencies" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "images" DROP COLUMN "id_place",
ADD COLUMN     "place_id" UUID NOT NULL,
ALTER COLUMN "url" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "languages" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "places" DROP COLUMN "state",
ADD COLUMN     "contactDetails_id" UUID NOT NULL,
ADD COLUMN     "languages_details" JSONB NOT NULL,
ADD COLUMN     "state_id" UUID NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "coordinates" SET NOT NULL,
ALTER COLUMN "id_category" SET NOT NULL,
ALTER COLUMN "details" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "preferences" DROP COLUMN "id_user",
ALTER COLUMN "preferences" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "states" ADD COLUMN     "region" "regions" NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "extension" SET NOT NULL,
ALTER COLUMN "population" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "visit_history" DROP COLUMN "id_atraccion",
DROP COLUMN "id_user",
ADD COLUMN     "event_id" UUID NOT NULL,
ADD COLUMN     "place_id" UUID NOT NULL,
ADD COLUMN     "state_id" UUID NOT NULL,
ALTER COLUMN "date_visit" SET NOT NULL,
ALTER COLUMN "images" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "wishlist" DROP COLUMN "id_place",
DROP COLUMN "id_user",
ADD COLUMN     "event_id" UUID NOT NULL,
ADD COLUMN     "place_id" UUID NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- DropTable
DROP TABLE "_PlaceToRoute";

-- DropTable
DROP TABLE "reviews";

-- DropTable
DROP TABLE "routes";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" TEXT NOT NULL,
    "rate" TEXT NOT NULL,
    "images" JSONB NOT NULL,
    "place_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planner" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "people" INTEGER NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "state_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities_planner" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "planner_id" UUID NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "place_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_planner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "state_id" UUID NOT NULL,
    "details" JSONB NOT NULL,
    "contactDetails_id" UUID NOT NULL,
    "isTradition" BOOLEAN NOT NULL,
    "languages_details" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT,
    "managedStateId" UUID,
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "categories"("id_category") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_contactDetails_id_fkey" FOREIGN KEY ("contactDetails_id") REFERENCES "contact_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_history" ADD CONSTRAINT "visit_history_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_history" ADD CONSTRAINT "visit_history_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_history" ADD CONSTRAINT "visit_history_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planner" ADD CONSTRAINT "planner_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities_planner" ADD CONSTRAINT "activities_planner_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "planner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities_planner" ADD CONSTRAINT "activities_planner_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities_planner" ADD CONSTRAINT "activities_planner_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_contactDetails_id_fkey" FOREIGN KEY ("contactDetails_id") REFERENCES "contact_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_managedStateId_fkey" FOREIGN KEY ("managedStateId") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
