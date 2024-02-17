/*
  Warnings:

  - Added the required column `isAdmin` to the `ChatParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatParticipant" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL;
