/*
  Warnings:

  - Added the required column `product_description` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "product_description" TEXT NOT NULL;
