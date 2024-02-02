-- CreateTable
CREATE TABLE "savedPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "postId" TEXT,

    CONSTRAINT "savedPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "savedPost" ADD CONSTRAINT "savedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savedPost" ADD CONSTRAINT "savedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
