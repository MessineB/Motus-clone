-- CreateTable
CREATE TABLE "public"."Word" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Game" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "attempts" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "tries" INTEGER NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_date_key" ON "public"."Word"("date");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "public"."User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
