/*
  Warnings:

  - Added the required column `public_key` to the `poll_vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "poll_vote" ADD COLUMN     "public_key" VARCHAR(1000) NOT NULL;
