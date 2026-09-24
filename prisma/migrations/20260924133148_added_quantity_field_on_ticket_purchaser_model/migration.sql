/*
  Warnings:

  - Added the required column `quantity` to the `ticket_purchasers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ticket_purchasers" ADD COLUMN     "quantity" INTEGER NOT NULL;
