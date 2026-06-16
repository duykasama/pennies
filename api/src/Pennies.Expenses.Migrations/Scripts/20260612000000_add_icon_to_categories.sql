ALTER TABLE "ExpenseCategories"
    ADD COLUMN IF NOT EXISTS "Icon" varchar(10) NULL;

UPDATE "ExpenseCategories" SET "Icon" = CASE "Id"
    WHEN 1 THEN '🍴'
    WHEN 2 THEN '🚌'
    WHEN 3 THEN '🛍'
    WHEN 4 THEN '🎬'
    WHEN 5 THEN '❤️'
    WHEN 6 THEN '⚡'
    WHEN 7 THEN '🏠'
    WHEN 8 THEN '···'
END;

ALTER TABLE "ExpenseCategories" ALTER COLUMN "Icon" SET NOT NULL;
