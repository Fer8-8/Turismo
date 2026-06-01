-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "status" "MediaStatus" NOT NULL DEFAULT 'PENDING';
