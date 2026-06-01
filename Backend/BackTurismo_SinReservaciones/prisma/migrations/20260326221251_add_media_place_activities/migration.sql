-- AlterTable
ALTER TABLE "media" ADD COLUMN     "place_activities_id" UUID;

-- AlterTable
ALTER TABLE "place_attributes" ALTER COLUMN "estimated_daily_cost_min" DROP NOT NULL,
ALTER COLUMN "estimated_daily_cost_max" DROP NOT NULL,
ALTER COLUMN "typical_visit_hours" DROP NOT NULL,
ALTER COLUMN "recommended_days" DROP NOT NULL,
ALTER COLUMN "culinary_speciality" DROP NOT NULL;

-- AlterTable
ALTER TABLE "places" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "states" ALTER COLUMN "extension" DROP NOT NULL,
ALTER COLUMN "population" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_place_activities_id_fkey" FOREIGN KEY ("place_activities_id") REFERENCES "place_activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
