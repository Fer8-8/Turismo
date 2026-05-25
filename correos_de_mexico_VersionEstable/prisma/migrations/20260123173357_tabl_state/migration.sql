/*
  Warnings:

  - The `country_id` column on the `cdm_address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `cdm_country` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `cdm_country` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `cdm_state` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `cdm_state` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `country_id` column on the `cdm_state` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `state_id` to the `cdm_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cdm_address" DROP COLUMN "state_id",
ADD COLUMN     "state_id" UUID NOT NULL,
DROP COLUMN "country_id",
ADD COLUMN     "country_id" UUID;

-- AlterTable
ALTER TABLE "cdm_country" DROP CONSTRAINT "cdm_country_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "cdm_country_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cdm_state" DROP CONSTRAINT "cdm_state_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "country_id",
ADD COLUMN     "country_id" UUID,
ADD CONSTRAINT "cdm_state_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "cdm_address" ADD CONSTRAINT "cdm_address_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "cdm_state"("id") ON DELETE CASCADE ON UPDATE CASCADE;
