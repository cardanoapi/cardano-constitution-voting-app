/*
  Warnings:

  - You are about to drop the column `description` on the `poll` table. All the data in the column will be lost.
  - Added the required column `hashedText` to the `poll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "poll" DROP COLUMN "description",
ADD COLUMN     "hashedText" VARCHAR(10000) NOT NULL,
ADD COLUMN     "link" VARCHAR(1000) NOT NULL;
