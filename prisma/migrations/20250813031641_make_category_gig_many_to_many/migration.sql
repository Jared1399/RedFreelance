/*
  Warnings:

  - You are about to drop the column `gigId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_gigId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "gigId";

-- CreateTable
CREATE TABLE "_CategoryToGig" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToGig_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToGig_B_index" ON "_CategoryToGig"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToGig" ADD CONSTRAINT "_CategoryToGig_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToGig" ADD CONSTRAINT "_CategoryToGig_B_fkey" FOREIGN KEY ("B") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
