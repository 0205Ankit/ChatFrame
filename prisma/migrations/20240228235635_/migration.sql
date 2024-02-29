/*
  Warnings:

  - You are about to drop the column `reaction` on the `Message` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "MsgType" ADD VALUE 'TEXT';

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "reaction",
ALTER COLUMN "type" SET DEFAULT 'TEXT';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userName" SET DEFAULT substring('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' FROM (floor(random() * 62) + 1)::integer FOR 10);
