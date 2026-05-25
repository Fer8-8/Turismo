ALTER TABLE "cdm_refunds"
  ADD COLUMN "state" TEXT,
  ADD COLUMN "response_code" TEXT,
  ADD COLUMN "gateway_code" TEXT,
  ADD COLUMN "gateway_metadata" JSONB;

CREATE INDEX "cdm_refunds_payment_id_idx" ON "cdm_refunds"("payment_id");
CREATE INDEX "cdm_refunds_state_idx" ON "cdm_refunds"("state");

CREATE TABLE "cdm_payment_webhook_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "gateway_code" TEXT NOT NULL,
  "provider_event_id" TEXT NOT NULL,
  "event_type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "payment_id" UUID,
  "payment_intent_id" TEXT,
  "payload" JSONB NOT NULL,
  "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processed_at" TIMESTAMP(3),
  "last_error" TEXT,
  CONSTRAINT "cdm_payment_webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "cdm_payment_webhook_events_provider_event_id_key"
  ON "cdm_payment_webhook_events"("provider_event_id");
CREATE INDEX "cdm_payment_webhook_events_status_idx"
  ON "cdm_payment_webhook_events"("status");
CREATE INDEX "cdm_payment_webhook_events_payment_id_idx"
  ON "cdm_payment_webhook_events"("payment_id");
CREATE INDEX "cdm_payment_webhook_events_payment_intent_id_idx"
  ON "cdm_payment_webhook_events"("payment_intent_id");

ALTER TABLE "cdm_payment_webhook_events"
  ADD CONSTRAINT "cdm_payment_webhook_events_payment_id_fkey"
  FOREIGN KEY ("payment_id") REFERENCES "cdm_payments"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
