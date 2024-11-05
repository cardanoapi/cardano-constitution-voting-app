/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `workshop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "workshop_name_key" ON "workshop"("name");
