/*
  Warnings:

  - You are about to drop the column `categiryId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Post_categiryId_idx` ON `Post`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `categiryId`,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Post_categoryId_idx` ON `Post`(`categoryId`);
