/*
  Warnings:

  - A unique constraint covering the columns `[image_hash]` on the table `skin_analyses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "skin_analyses" ADD COLUMN     "image_hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "skin_analyses_image_hash_key" ON "skin_analyses"("image_hash");
