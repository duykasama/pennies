ALTER TABLE "ExpenseCategories"
    ADD COLUMN IF NOT EXISTS "DisplayOrder" smallint NOT NULL DEFAULT 0;

UPDATE "ExpenseCategories" SET "DisplayOrder" = "Id";

ALTER TABLE "ExpenseCategories" ALTER COLUMN "DisplayOrder" DROP DEFAULT;

ALTER TABLE "ExpenseFrequencies"
    ADD COLUMN IF NOT EXISTS "DisplayOrder" smallint NOT NULL DEFAULT 0;

-- Daily=1, Weekly=2, Monthly=3, Yearly=4
UPDATE "ExpenseFrequencies" SET "DisplayOrder" = CASE "Id"
    WHEN 1 THEN 1
    WHEN 2 THEN 2
    WHEN 4 THEN 3
    WHEN 3 THEN 4
    ELSE "Id"
END;

ALTER TABLE "ExpenseFrequencies" ALTER COLUMN "DisplayOrder" DROP DEFAULT;
