-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "delivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "delivery_count" INTEGER NOT NULL DEFAULT 0;
