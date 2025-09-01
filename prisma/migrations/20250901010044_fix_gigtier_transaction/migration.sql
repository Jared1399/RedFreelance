/*
  Warnings:

  - Added the required column `tierId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "tierId" TEXT NOT NULL,
ALTER COLUMN "lifecycleId" SET DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "GigTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
