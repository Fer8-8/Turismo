ALTER TABLE "cdm_order_promotions"
ADD COLUMN "promo_total" DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
ADD COLUMN "reason" TEXT,
ADD COLUMN "evaluation_snapshot" TEXT;
