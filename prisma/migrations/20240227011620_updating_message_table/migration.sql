-- CreateEnum
CREATE TYPE "MsgType" AS ENUM ('AUDIO', 'POST', 'PHOTO');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "reaction" TEXT DEFAULT '',
ADD COLUMN     "repliedToMessageId" TEXT,
ADD COLUMN     "type" "MsgType" NOT NULL DEFAULT 'AUDIO';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userName" SET DEFAULT substring('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' FROM (floor(random() * 62) + 1)::integer FOR 10);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_repliedToMessageId_fkey" FOREIGN KEY ("repliedToMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
