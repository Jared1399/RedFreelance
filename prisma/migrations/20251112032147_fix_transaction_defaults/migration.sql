/*
  Warnings:

  - Made the column `createdAt` on table `Ad` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Ad` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Feedback` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Feedback` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Gig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Gig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `GigTier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `GigTier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Lifecycle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Lifecycle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Portfolio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Portfolio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ad" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Gig" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "GigTier" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Lifecycle" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Likes" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "requestDetails" SET DEFAULT '',
ALTER COLUMN "baseConditions" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
