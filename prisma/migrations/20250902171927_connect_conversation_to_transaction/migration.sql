/*
  Warnings:

  - Added the required column `transactionId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "transactionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
