/*
  Warnings:

  - You are about to drop the column `tries` on the `Game` table. All the data in the column will be lost.
  - Added the required column `wordId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Game" DROP CONSTRAINT "Game_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Game" DROP COLUMN "tries",
ADD COLUMN     "wordId" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
