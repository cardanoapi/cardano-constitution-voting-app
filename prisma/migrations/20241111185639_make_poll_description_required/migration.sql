/*
  Warnings:

  - Made the column `description` on table `poll` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "poll" ALTER COLUMN "description" SET NOT NULL;
