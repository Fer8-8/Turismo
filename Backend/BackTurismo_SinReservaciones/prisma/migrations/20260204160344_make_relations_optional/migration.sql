-- AlterTable
ALTER TABLE "RecommendationLogs" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "session_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "place_activities" ALTER COLUMN "place_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "place_attributes" ALTER COLUMN "place_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "place_features_cache" ALTER COLUMN "place_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "place_review_details" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "place_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "place_tags" ALTER COLUMN "place_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_features_cache" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_session" ALTER COLUMN "user_id" DROP NOT NULL;
