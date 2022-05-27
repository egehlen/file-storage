-- CreateTable
CREATE TABLE "Quota" (
    "id" TEXT NOT NULL,
    "totalUsed" INTEGER NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Quota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quota_accountId_key" ON "Quota"("accountId");

-- AddForeignKey
ALTER TABLE "Quota" ADD CONSTRAINT "Quota_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
