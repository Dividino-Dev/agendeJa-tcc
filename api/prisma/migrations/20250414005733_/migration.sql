/*
  Warnings:

  - A unique constraint covering the columns `[profileId,dateTime]` on the table `TimeSlot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TimeSlot_profileId_dateTime_key" ON "TimeSlot"("profileId", "dateTime");
