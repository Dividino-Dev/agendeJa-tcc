/*
  Warnings:

  - You are about to drop the `ProfileProfessional` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileProfessional" DROP CONSTRAINT "ProfileProfessional_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileProfessional" DROP CONSTRAINT "ProfileProfessional_profileId_fkey";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "daysOfWeekWorked" TEXT[],
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "serviceDuration" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3),
ADD COLUMN     "typeOfService" TEXT[];

-- DropTable
DROP TABLE "ProfileProfessional";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
