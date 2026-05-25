-- AlterTable: add gateway/stripe columns to cdm_payments
ALTER TABLE "cdm_payments" ADD COLUMN "gateway_code" TEXT;
ALTER TABLE "cdm_payments" ADD COLUMN "payment_intent_id" TEXT;
ALTER TABLE "cdm_payments" ADD COLUMN "captured_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.0;
ALTER TABLE "cdm_payments" ADD COLUMN "gateway_metadata" JSONB;

-- CreateIndex
CREATE INDEX "cdm_payments_order_id_idx" ON "cdm_payments"("order_id");
CREATE INDEX "cdm_payments_payment_intent_id_idx" ON "cdm_payments"("payment_intent_id");
