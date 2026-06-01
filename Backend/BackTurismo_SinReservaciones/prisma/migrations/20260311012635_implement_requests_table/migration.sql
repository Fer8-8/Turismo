-- CreateEnum
CREATE TYPE "request_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "place_request" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" "request_status" NOT NULL DEFAULT 'pending',
    "id_user" TEXT NOT NULL,
    "place_json" JSONB NOT NULL,
    "id_place" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "place_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "place_request" ADD CONSTRAINT "place_request_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_request" ADD CONSTRAINT "place_request_id_place_fkey" FOREIGN KEY ("id_place") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;
