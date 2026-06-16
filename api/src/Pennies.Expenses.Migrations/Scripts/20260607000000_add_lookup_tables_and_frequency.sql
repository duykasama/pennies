-- 1. Create lookup tables

CREATE TABLE IF NOT EXISTS "ExpenseCategories" (
    "Id"        smallint     NOT NULL,
    "Name"      varchar(50)  NOT NULL,
    "CreatedAt" timestamptz  NOT NULL,
    "UpdatedAt" timestamptz  NOT NULL,
    "IsDeleted" boolean      NOT NULL DEFAULT FALSE,
    CONSTRAINT "PK_ExpenseCategories" PRIMARY KEY ("Id")
);

INSERT INTO "ExpenseCategories" ("Id", "Name", "CreatedAt", "UpdatedAt") VALUES
    (1, 'Food',          now(), now()),
    (2, 'Transport',     now(), now()),
    (3, 'Shopping',      now(), now()),
    (4, 'Entertainment', now(), now()),
    (5, 'Health',        now(), now()),
    (6, 'Utilities',     now(), now()),
    (7, 'Housing',       now(), now()),
    (8, 'Other',         now(), now())
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS "ExpenseFrequencies" (
    "Id"        smallint     NOT NULL,
    "Name"      varchar(50)  NOT NULL,
    "CreatedAt" timestamptz  NOT NULL,
    "UpdatedAt" timestamptz  NOT NULL,
    "IsDeleted" boolean      NOT NULL DEFAULT FALSE,
    CONSTRAINT "PK_ExpenseFrequencies" PRIMARY KEY ("Id")
);

INSERT INTO "ExpenseFrequencies" ("Id", "Name", "CreatedAt", "UpdatedAt") VALUES
    (1, 'Daily',  now(), now()),
    (2, 'Weekly', now(), now()),
    (3, 'Yearly', now(), now())
ON CONFLICT DO NOTHING;

-- 2. Migrate Category column: varchar(50) → smallint FK

ALTER TABLE "Expenses" ADD COLUMN IF NOT EXISTS "CategoryId" smallint;

UPDATE "Expenses" SET "CategoryId" = CASE "Category"
    WHEN 'Food'          THEN 1
    WHEN 'Transport'     THEN 2
    WHEN 'Shopping'      THEN 3
    WHEN 'Entertainment' THEN 4
    WHEN 'Health'        THEN 5
    WHEN 'Utilities'     THEN 6
    WHEN 'Housing'       THEN 7
    ELSE 8
END
WHERE "CategoryId" IS NULL;

ALTER TABLE "Expenses" ALTER COLUMN "CategoryId" SET NOT NULL;
ALTER TABLE "Expenses" DROP COLUMN IF EXISTS "Category";
ALTER TABLE "Expenses" RENAME COLUMN "CategoryId" TO "Category";

ALTER TABLE "Expenses"
    ADD CONSTRAINT "FK_Expenses_ExpenseCategories"
    FOREIGN KEY ("Category") REFERENCES "ExpenseCategories" ("Id");

-- 3. Add Frequency column (nullable FK)

ALTER TABLE "Expenses" ADD COLUMN IF NOT EXISTS "Frequency" smallint NULL;

ALTER TABLE "Expenses"
    ADD CONSTRAINT "FK_Expenses_ExpenseFrequencies"
    FOREIGN KEY ("Frequency") REFERENCES "ExpenseFrequencies" ("Id");
