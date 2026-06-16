-- 1. Create translation tables

CREATE TABLE IF NOT EXISTS "ExpenseCategoryTranslations" (
    "Id"         serial       NOT NULL,
    "CategoryId" smallint     NOT NULL,
    "Language"   varchar(10)  NOT NULL,
    "IsDefault"  boolean      NOT NULL DEFAULT FALSE,
    "Name"       varchar(100) NOT NULL,
    "CreatedAt"  timestamptz  NOT NULL,
    "UpdatedAt"  timestamptz  NOT NULL,
    CONSTRAINT "PK_ExpenseCategoryTranslations" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ExpenseCategoryTranslations_Category"
        FOREIGN KEY ("CategoryId") REFERENCES "ExpenseCategories" ("Id"),
    CONSTRAINT "UQ_ExpenseCategoryTranslations_CategoryLanguage"
        UNIQUE ("CategoryId", "Language")
);

CREATE TABLE IF NOT EXISTS "ExpenseFrequencyTranslations" (
    "Id"          serial       NOT NULL,
    "FrequencyId" smallint     NOT NULL,
    "Language"    varchar(10)  NOT NULL,
    "IsDefault"   boolean      NOT NULL DEFAULT FALSE,
    "Name"        varchar(100) NOT NULL,
    "CreatedAt"   timestamptz  NOT NULL,
    "UpdatedAt"   timestamptz  NOT NULL,
    CONSTRAINT "PK_ExpenseFrequencyTranslations" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ExpenseFrequencyTranslations_Frequency"
        FOREIGN KEY ("FrequencyId") REFERENCES "ExpenseFrequencies" ("Id"),
    CONSTRAINT "UQ_ExpenseFrequencyTranslations_FrequencyLanguage"
        UNIQUE ("FrequencyId", "Language")
);

-- 2. Seed English (default) from existing Name column

INSERT INTO "ExpenseCategoryTranslations" ("CategoryId", "Language", "IsDefault", "Name", "CreatedAt", "UpdatedAt")
SELECT "Id", 'en', TRUE, "Name", now(), now()
FROM "ExpenseCategories"
ON CONFLICT DO NOTHING;

INSERT INTO "ExpenseFrequencyTranslations" ("FrequencyId", "Language", "IsDefault", "Name", "CreatedAt", "UpdatedAt")
SELECT "Id", 'en', TRUE, "Name", now(), now()
FROM "ExpenseFrequencies"
ON CONFLICT DO NOTHING;

-- 3. Drop Name column from lookup tables (now in translations)

ALTER TABLE "ExpenseCategories" DROP COLUMN IF EXISTS "Name";
ALTER TABLE "ExpenseFrequencies" DROP COLUMN IF EXISTS "Name";
