/*
  Warnings:

  - You are about to drop the column `elements` on the `Tabs` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Shape" AS ENUM ('RECTANGLE', 'CIRCLE', 'ARROW', 'LINE', 'RHOMBUS');

-- AlterTable
ALTER TABLE "Tabs" DROP COLUMN "elements";

-- CreateTable
CREATE TABLE "Element" (
    "elementId" TEXT NOT NULL,
    "tabId" TEXT NOT NULL,
    "shape" "Shape" NOT NULL,
    "lastModifiedOn" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("elementId")
);

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_tabId_fkey" FOREIGN KEY ("tabId") REFERENCES "Tabs"("tabId") ON DELETE RESTRICT ON UPDATE CASCADE;
