-- Marketing Wave 1: extend Promotion with active flag and usage tracking
-- and add preferences to PromotionAction for action parameters

ALTER TABLE "cdm_promotions" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "cdm_promotions" ADD COLUMN "usage_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "cdm_promotion_actions" ADD COLUMN "preferences" TEXT;
