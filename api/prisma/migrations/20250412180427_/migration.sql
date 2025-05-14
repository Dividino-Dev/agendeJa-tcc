/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Scheduling" DROP CONSTRAINT "Scheduling_professionalId_fkey";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "Scheduling" ADD CONSTRAINT "Scheduling_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
