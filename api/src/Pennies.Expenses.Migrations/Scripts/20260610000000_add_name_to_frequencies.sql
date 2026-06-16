ALTER TABLE "ExpenseFrequencies"
    ADD COLUMN IF NOT EXISTS "Name" varchar(50) NOT NULL DEFAULT '';

UPDATE "ExpenseFrequencies" f
SET "Name" = (
    SELECT t."Name"
    FROM "ExpenseFrequencyTranslations" t
    WHERE t."FrequencyId" = f."Id"
      AND t."IsDefault" = TRUE
    LIMIT 1
);

ALTER TABLE "ExpenseFrequencies" ALTER COLUMN "Name" DROP DEFAULT;
