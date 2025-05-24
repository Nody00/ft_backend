/*
  Warnings:

  - You are about to drop the column `billing` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `dashboard` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `reports` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `roles` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Action" AS ENUM ('READ', 'CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "Resource" AS ENUM ('USER', 'PERMISSION', 'INCOME', 'EXPENSE', 'TRANSFER', 'EXPENSE_TYPE', 'INCOME_TYPE', 'NOTIFICATION');

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "billing",
DROP COLUMN "dashboard",
DROP COLUMN "reports",
DROP COLUMN "settings";

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "resource" "Resource" NOT NULL,
    "actions" "Action"[],

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_roleId_resource_key" ON "permissions"("roleId", "resource");

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
