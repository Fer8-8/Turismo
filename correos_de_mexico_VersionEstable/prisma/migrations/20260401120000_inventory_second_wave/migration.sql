ALTER TABLE "cdm_stock_transfers"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN "variant_id" UUID,
ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "completed_at" TIMESTAMP(3),
ADD COLUMN "cancelled_at" TIMESTAMP(3);

ALTER TABLE "cdm_stock_transfers"
ADD CONSTRAINT "cdm_stock_transfers_variant_id_fkey"
FOREIGN KEY ("variant_id") REFERENCES "cdm_variants"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "cdm_stock_transfers_variant_id_status_idx"
ON "cdm_stock_transfers"("variant_id", "status");

CREATE INDEX "cdm_stock_transfers_source_destination_idx"
ON "cdm_stock_transfers"("source_location_id", "destination_location_id");