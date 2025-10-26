-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "InterviewSession" 
ADD COLUMN "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN "endedAt" TIMESTAMP(3);
