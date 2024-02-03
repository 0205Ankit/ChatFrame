-- DropIndex
DROP INDEX "User_userName_idx";

-- CreateIndex
CREATE INDEX "User_userName_email_idx" ON "User"("userName", "email");
