-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'authorized', 'paid', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('WEBPAY_PLUS', 'ONECLICK', 'REFUND', 'CAPTURE');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "kind" "PaymentType" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "amount" DECIMAL(65,30) NOT NULL,
    "buyOrder" TEXT,
    "sessionId" TEXT,
    "token" TEXT,
    "authorizationCode" TEXT,
    "paymentTypeCode" TEXT,
    "accountingDate" TEXT,
    "transactionDate" TIMESTAMP(3),
    "installments" INTEGER,
    "cardLast4" TEXT,
    "cardType" TEXT,
    "responseCode" INTEGER,
    "refundedAmount" DECIMAL(65,30),
    "refundDate" TIMESTAMP(3),
    "refundToken" TEXT,
    "raw" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
