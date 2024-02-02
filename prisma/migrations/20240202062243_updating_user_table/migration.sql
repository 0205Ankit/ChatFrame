/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Like` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Follows` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId,userId]` on the table `savedPost` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Follows` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `userId` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postId` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `savedPost` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postId` on table `savedPost` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "savedPost" DROP CONSTRAINT "savedPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "savedPost" DROP CONSTRAINT "savedPost_userId_fkey";

-- AlterTable
ALTER TABLE "Follows" ADD COLUMN     "id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
DROP COLUMN "id",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "postId" SET NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("postId", "userId");

-- AlterTable
ALTER TABLE "savedPost" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "postId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Follows_id_key" ON "Follows"("id");

-- CreateIndex
CREATE UNIQUE INDEX "savedPost_postId_userId_key" ON "savedPost"("postId", "userId");

-- AddForeignKey
ALTER TABLE "savedPost" ADD CONSTRAINT "savedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savedPost" ADD CONSTRAINT "savedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
