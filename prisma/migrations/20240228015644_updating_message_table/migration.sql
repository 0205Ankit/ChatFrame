/*
  Warnings:

  - You are about to drop the column `isReadByReciever` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "isReadByReciever",
ADD COLUMN     "isReadByRecievers" TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userName" SET DEFAULT substring('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' FROM (floor(random() * 62) + 1)::integer FOR 10);
