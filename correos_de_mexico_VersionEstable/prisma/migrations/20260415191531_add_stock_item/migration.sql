/*
  Warnings:

  - You are about to drop the column `delivered_at` on the `cdm_shipments` table. All the data in the column will be lost.
  - You are about to drop the column `ready_at` on the `cdm_shipments` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `cdm_shipping_categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `cdm_stores` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "cdm_payments_order_id_idx";

-- DropIndex
DROP INDEX "cdm_refunds_payment_id_idx";

-- DropIndex
DROP INDEX "cdm_refunds_state_idx";

-- DropIndex
DROP INDEX "cdm_shipments_order_id_state_idx";

-- DropIndex
DROP INDEX "cdm_shipments_tracking_idx";

-- DropIndex
DROP INDEX "cdm_shipping_categories_code_idx";

-- DropIndex
DROP INDEX "cdm_shipping_categories_store_id_idx";

-- DropIndex
DROP INDEX "cdm_shipping_methods_code_idx";

-- DropIndex
DROP INDEX "cdm_shipping_methods_store_id_active_idx";

-- AlterTable
ALTER TABLE "cdm_assets" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "cdm_shipments" DROP COLUMN "delivered_at",
DROP COLUMN "ready_at";

-- AlterTable
ALTER TABLE "cdm_shipping_categories" DROP COLUMN "code",
ALTER COLUMN "is_global" SET DEFAULT false;

-- AlterTable
ALTER TABLE "cdm_shipping_methods" ALTER COLUMN "is_global" SET DEFAULT false;

-- AlterTable
ALTER TABLE "cdm_stores" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "cdm_users" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "friendly_id_slugs" ADD COLUMN     "is_primary" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "cdm_friendly_slugs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "sluggable_id" UUID,
    "sluggable_type" TEXT,
    "scope" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cdm_friendly_slugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdm_outbox_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "eventName" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "cdm_outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cdm_outbox_events_eventId_key" ON "cdm_outbox_events"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "cdm_stores_code_key" ON "cdm_stores"("code");

-- RenameIndex
ALTER INDEX "cdm_stock_transfers_source_destination_idx" RENAME TO "cdm_stock_transfers_source_location_id_destination_location_idx";
