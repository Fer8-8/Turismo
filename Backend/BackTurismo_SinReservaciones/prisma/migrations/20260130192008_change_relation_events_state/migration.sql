/*
  Warnings:

  - You are about to drop the `_EventsToStates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventsToStates" DROP CONSTRAINT "_EventsToStates_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventsToStates" DROP CONSTRAINT "_EventsToStates_B_fkey";

-- DropTable
DROP TABLE "_EventsToStates";

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_id_state_fkey" FOREIGN KEY ("id_state") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;
