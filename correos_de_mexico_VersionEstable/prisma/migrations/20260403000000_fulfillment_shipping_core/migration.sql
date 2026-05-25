ALTER TABLE "cdm_shipments"
ADD COLUMN "pending_at" TIMESTAMP(3),
ADD COLUMN "ready_at" TIMESTAMP(3),
ADD COLUMN "delivered_at" TIMESTAMP(3);

CREATE INDEX "cdm_shipments_order_id_state_idx"
ON "cdm_shipments"("order_id", "state");

CREATE INDEX "cdm_shipments_tracking_idx"
ON "cdm_shipments"("tracking");

ALTER TABLE "cdm_shipping_methods"
ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "is_global" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "configuration" JSONB,
ADD COLUMN "store_id" UUID;

CREATE INDEX "cdm_shipping_methods_store_id_active_idx"
ON "cdm_shipping_methods"("store_id", "active");

CREATE INDEX "cdm_shipping_methods_code_idx"
ON "cdm_shipping_methods"("code");

ALTER TABLE "cdm_shipping_methods"
ADD CONSTRAINT "cdm_shipping_methods_store_id_fkey"
FOREIGN KEY ("store_id") REFERENCES "cdm_stores"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "cdm_shipping_categories"
ADD COLUMN "code" TEXT,
ADD COLUMN "is_global" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "store_id" UUID;

CREATE INDEX "cdm_shipping_categories_store_id_idx"
ON "cdm_shipping_categories"("store_id");

CREATE INDEX "cdm_shipping_categories_code_idx"
ON "cdm_shipping_categories"("code");

ALTER TABLE "cdm_shipping_categories"
ADD CONSTRAINT "cdm_shipping_categories_store_id_fkey"
FOREIGN KEY ("store_id") REFERENCES "cdm_stores"("id")
ON DELETE SET NULL ON UPDATE CASCADE;