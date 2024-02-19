/*
  Warnings:

  - The primary key for the `ChatParticipant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ChatParticipant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatParticipant" DROP CONSTRAINT "ChatParticipant_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ChatParticipant_pkey" PRIMARY KEY ("userId", "chatId");
