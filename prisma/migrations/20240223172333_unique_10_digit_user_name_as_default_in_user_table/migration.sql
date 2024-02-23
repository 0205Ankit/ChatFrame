-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userName" SET DEFAULT substring('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' FROM (floor(random() * 62) + 1)::integer FOR 10);
