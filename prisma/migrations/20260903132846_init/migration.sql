-- CreateTable
CREATE TABLE "Fleet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#3B9EF5',
    "companies" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fleet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Fleet_createdAt_id_idx" ON "Fleet"("createdAt" DESC, "id" DESC);
