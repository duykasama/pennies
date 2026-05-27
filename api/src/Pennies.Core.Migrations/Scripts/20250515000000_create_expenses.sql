CREATE TABLE IF NOT EXISTS "Expenses"
(
    "Id"          uuid          NOT NULL,
    "UserId"      text          NOT NULL,
    "Title"       varchar(200)  NOT NULL,
    "Description" varchar(1000) NULL,
    "Amount"      numeric(18,2) NOT NULL,
    "Category"    varchar(50)   NOT NULL,
    "Date"        date          NOT NULL,
    "CreatedAt"   timestamptz   NOT NULL,
    "UpdatedAt"   timestamptz   NOT NULL,
    CONSTRAINT "PK_Expenses" PRIMARY KEY ("Id")
);
