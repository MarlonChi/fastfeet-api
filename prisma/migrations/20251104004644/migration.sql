/*
  Warnings:

  - You are about to drop the column `document_id` on the `recipients` table. All the data in the column will be lost.
  - You are about to drop the column `document_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[documentId]` on the table `recipients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `recipients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[documentId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentId` to the `recipients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `recipients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."recipients_document_id_key";

-- DropIndex
DROP INDEX "public"."users_document_id_key";

-- AlterTable
ALTER TABLE "recipients" DROP COLUMN "document_id",
ADD COLUMN     "documentId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "document_id",
ADD COLUMN     "documentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "recipients_documentId_key" ON "recipients"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_email_key" ON "recipients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_documentId_key" ON "users"("documentId");
