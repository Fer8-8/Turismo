-- CreateTable
CREATE TABLE "cdm_stock_reservations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stock_item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "originator_type" TEXT,
    "originator_id" UUID,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdm_stock_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cdm_stock_reservations_stock_item_id_status_idx" ON "cdm_stock_reservations"("stock_item_id", "status");

-- AddForeignKey
ALTER TABLE "cdm_stock_reservations" ADD CONSTRAINT "cdm_stock_reservations_stock_item_id_fkey"
    FOREIGN KEY ("stock_item_id") REFERENCES "cdm_stock_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
