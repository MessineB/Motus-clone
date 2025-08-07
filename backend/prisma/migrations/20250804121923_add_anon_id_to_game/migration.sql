-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Game" ADD COLUMN     "anonId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
