-- CreateEnum
CREATE TYPE "travel_party_types" AS ENUM ('solo', 'couple', 'family', 'friends', 'business');

-- CreateEnum
CREATE TYPE "tag_categories" AS ENUM ('activity', 'type', 'environment', 'characteristics', 'public');

-- CreateEnum
CREATE TYPE "difficulty_levels" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "beach_types" AS ENUM ('virgin', 'semi_virgin', 'developed', 'urban');

-- CreateEnum
CREATE TYPE "wave_types" AS ENUM ('calm', 'moderate', 'strong');

-- CreateEnum
CREATE TYPE "crowd_levels" AS ENUM ('solitary', 'tranquil', 'moderate', 'crowded', 'very_crowded');

-- CreateEnum
CREATE TYPE "development_levels" AS ENUM ('virgin', 'minimum', 'moderate', 'high', 'commercial');

-- CreateEnum
CREATE TYPE "environment_types" AS ENUM ('natural', 'urban', 'mixed', 'rural');

-- CreateEnum
CREATE TYPE "price_levels" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "device_types" AS ENUM ('mobile', 'desktop');

-- CreateEnum
CREATE TYPE "interaction_types" AS ENUM ('view', 'click', 'favorite', 'unfavorite', 'share', 'save', 'book', 'review', 'search_result_click');

-- CreateTable
CREATE TABLE "user_interactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT,
    "place_id" UUID,
    "interaction_type" "interaction_types" NOT NULL,
    "interaction_weight" DECIMAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "device_type" "device_types" NOT NULL,
    "source" TEXT NOT NULL,
    "time_spent_seconds" INTEGER NOT NULL,
    "scroll_depth" DECIMAL(65,30) NOT NULL,
    "position_in_list" INTEGER NOT NULL,
    "recommendation_algorithm" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_attributes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "place_id" UUID NOT NULL,
    "municipality" TEXT NOT NULL,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "is_pueblo_magico" BOOLEAN NOT NULL DEFAULT false,
    "is_unesco_heritage" BOOLEAN NOT NULL DEFAULT false,
    "is_protected_area" BOOLEAN NOT NULL DEFAULT false,
    "price_level" "price_levels" NOT NULL,
    "estimated_daily_cost_min" DECIMAL NOT NULL,
    "estimated_daily_cost_max" DECIMAL NOT NULL,
    "accommodation_avg_cost" INTEGER NOT NULL,
    "food_avg_cost" INTEGER NOT NULL,
    "best_seasons" JSONB NOT NULL,
    "avoid_seasons" JSONB NOT NULL,
    "ideal_months" JSONB NOT NULL,
    "typical_visit_hours" DECIMAL NOT NULL,
    "recommended_days" INTEGER NOT NULL,
    "has_vegan_options" BOOLEAN NOT NULL DEFAULT false,
    "has_vegetarian_options" BOOLEAN NOT NULL DEFAULT false,
    "has_gluten_free" BOOLEAN NOT NULL DEFAULT false,
    "cuisine_types" JSONB NOT NULL,
    "culinary_speciality" TEXT NOT NULL,
    "has_nightlife" BOOLEAN NOT NULL DEFAULT false,
    "wheelchair_accessible" BOOLEAN NOT NULL DEFAULT false,
    "has_parking" BOOLEAN NOT NULL DEFAULT false,
    "pet_friendly" BOOLEAN NOT NULL DEFAULT false,
    "environment_type" "environment_types" NOT NULL,
    "development_level" "development_levels" NOT NULL,
    "crowd_level" "crowd_levels" NOT NULL,
    "beach_type" "beach_types" NOT NULL,
    "sand_color" TEXT NOT NULL,
    "wave_type" "wave_types" NOT NULL,
    "has_reef" BOOLEAN NOT NULL DEFAULT false,
    "avg_temp_summer_celsius" DECIMAL NOT NULL,
    "avg_temp_winter_celsius" DECIMAL NOT NULL,
    "requires_guide" BOOLEAN NOT NULL DEFAULT false,
    "requires_permit" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "place_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_activities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "place_id" UUID NOT NULL,
    "activity_name" TEXT NOT NULL,
    "difficulty_level" "difficulty_levels" NOT NULL,
    "min_age" INTEGER NOT NULL,
    "requires_equipment" BOOLEAN NOT NULL DEFAULT false,
    "additional_cost" DECIMAL NOT NULL,
    "available_months" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "place_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tag_name" TEXT NOT NULL,
    "tag_category" "tag_categories" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "place_id" UUID NOT NULL,
    "relevance_score" DECIMAL NOT NULL,

    CONSTRAINT "place_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_review_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "place_id" UUID NOT NULL,
    "overral_rating" INTEGER NOT NULL,
    "value_rating" DECIMAL NOT NULL,
    "cleanliness_rating" DECIMAL NOT NULL,
    "activities_rating" DECIMAL NOT NULL,
    "foot_rating" DECIMAL NOT NULL,
    "review_title" TEXT NOT NULL,
    "review_text" TEXT NOT NULL,
    "visit_date" TIMESTAMP(3) NOT NULL,
    "travel_party_type" "travel_party_types" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "place_review_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_features_cache" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "total_interactions" INTEGER NOT NULL DEFAULT 0,
    "total_favorites" INTEGER NOT NULL DEFAULT 0,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "total_booking" INTEGER NOT NULL DEFAULT 0,
    "top_catergories" JSONB NOT NULL,
    "top_states" JSONB NOT NULL,
    "top_activities" JSONB NOT NULL,
    "avg_price_level_interacted" TEXT NOT NULL,
    "avg_daily_cost_preference" INTEGER NOT NULL,
    "avg_session_duration_seconds" INTEGER NOT NULL,
    "favorite_ratio" DECIMAL NOT NULL,
    "booking_conversation_ratio" DECIMAL NOT NULL,
    "adventure_level_score" DECIMAL NOT NULL,
    "cultural_interest_score" DECIMAL NOT NULL,
    "beach_preference_score" DECIMAL NOT NULL,
    "nightlife_interest_score" DECIMAL NOT NULL,
    "last_interaction_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_features_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_features_cache" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "place_id" UUID NOT NULL,
    "total_interactions" INTEGER NOT NULL DEFAULT 0,
    "total_favorites" INTEGER NOT NULL DEFAULT 0,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "total_bookings" INTEGER NOT NULL DEFAULT 0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "avg_overral_rating" DECIMAL NOT NULL,
    "avg_value_rating" DECIMAL NOT NULL,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "views_last_7_days" INTEGER NOT NULL DEFAULT 0,
    "views_last_30_days" INTEGER NOT NULL DEFAULT 0,
    "trending_score" DECIMAL NOT NULL,
    "avg_visitor_age_rate" TEXT NOT NULL,
    "primary_travel_party_type" "travel_party_types" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "place_features_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "device_type" "device_types" NOT NULL,
    "device_os" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "duration_seconds" INTEGER NOT NULL,
    "page_views" INTEGER NOT NULL,
    "had_interaction" BOOLEAN NOT NULL DEFAULT false,
    "had_favorite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationLogs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "session_id" UUID NOT NULL,
    "request_context" JSONB NOT NULL,
    "algorithm_version" TEXT NOT NULL,
    "model_version" TEXT NOT NULL,
    "recommended_places" JSONB NOT NULL,
    "places_clicked" JSONB NOT NULL,
    "places_favorited" JSONB NOT NULL,
    "time_to_first_click_seconds" INTEGER NOT NULL,
    "total_engagement_score" DECIMAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "place_attributes_place_id_key" ON "place_attributes"("place_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_tag_name_key" ON "tags"("tag_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_features_cache_user_id_key" ON "user_features_cache"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "place_features_cache_place_id_key" ON "place_features_cache"("place_id");

-- AddForeignKey
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_attributes" ADD CONSTRAINT "place_attributes_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_activities" ADD CONSTRAINT "place_activities_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_tags" ADD CONSTRAINT "place_tags_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_review_details" ADD CONSTRAINT "place_review_details_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_review_details" ADD CONSTRAINT "place_review_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_features_cache" ADD CONSTRAINT "user_features_cache_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_features_cache" ADD CONSTRAINT "place_features_cache_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLogs" ADD CONSTRAINT "RecommendationLogs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLogs" ADD CONSTRAINT "RecommendationLogs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "user_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
