/*
  Warnings:

  - Added the required column `serviceDuration` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "serviceDuration",
ADD COLUMN     "serviceDuration" INTEGER NOT NULL;
