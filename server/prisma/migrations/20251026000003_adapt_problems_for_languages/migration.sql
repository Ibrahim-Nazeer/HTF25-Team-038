-- AlterTable
ALTER TABLE "Problem" 
ALTER COLUMN "starterCode" TYPE JSONB USING 
  CASE 
    WHEN "starterCode" IS NULL THEN NULL
    ELSE jsonb_build_object('javascript', "starterCode")
  END,
ADD COLUMN "category" TEXT,
ADD COLUMN "functionName" TEXT;
