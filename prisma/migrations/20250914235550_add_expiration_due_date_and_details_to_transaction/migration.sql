/*
  Warnings:

  - Added the required column `baseConditions` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "baseConditions" JSONB NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "expirationDate" TIMESTAMP(3) NOT NULL;
