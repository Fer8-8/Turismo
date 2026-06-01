-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "id_category" UUID;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "categories"("id_category") ON DELETE SET NULL ON UPDATE CASCADE;
