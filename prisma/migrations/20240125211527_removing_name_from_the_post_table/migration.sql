/*
  Warnings:

  - You are about to drop the column `name` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Post_name_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "name";

-- CreateIndex
CREATE INDEX "Post_createdById_idx" ON "Post"("createdById");
