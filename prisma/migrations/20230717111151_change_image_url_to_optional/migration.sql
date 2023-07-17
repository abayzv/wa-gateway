/*
  Warnings:

  - The `action` column on the `Permission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `BroadcastMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BroadcastMessage" DROP COLUMN "type",
ADD COLUMN     "type" "BroadcastType" NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "action",
ADD COLUMN     "action" "PermissionAction" NOT NULL DEFAULT 'GET';
