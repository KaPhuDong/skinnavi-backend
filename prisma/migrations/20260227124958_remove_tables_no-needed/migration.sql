/*
  Warnings:

  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkinAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VirtualShelf` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_session_id_fkey";

-- DropForeignKey
ALTER TABLE "ChatSession" DROP CONSTRAINT "ChatSession_user_id_fkey";

-- DropForeignKey
ALTER TABLE "SkinAnalysis" DROP CONSTRAINT "SkinAnalysis_user_id_fkey";

-- DropForeignKey
ALTER TABLE "VirtualShelf" DROP CONSTRAINT "VirtualShelf_product_id_fkey";

-- DropForeignKey
ALTER TABLE "VirtualShelf" DROP CONSTRAINT "VirtualShelf_user_id_fkey";

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "ChatSession";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "SkinAnalysis";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VirtualShelf";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "ProductStatus";

-- DropEnum
DROP TYPE "SenderRole";

-- DropEnum
DROP TYPE "SkinType";
