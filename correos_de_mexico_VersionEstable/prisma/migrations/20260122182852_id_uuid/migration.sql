/*
  Warnings:

  - The primary key for the `cdm_address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `cdm_address` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "cdm_address" DROP CONSTRAINT "cdm_address_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "cdm_address_pkey" PRIMARY KEY ("id");
