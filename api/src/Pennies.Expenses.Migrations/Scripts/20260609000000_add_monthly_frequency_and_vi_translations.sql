-- 1. Add Monthly frequency

INSERT INTO "ExpenseFrequencies" ("Id", "CreatedAt", "UpdatedAt") VALUES
    (4, now(), now())
ON CONFLICT DO NOTHING;

INSERT INTO "ExpenseFrequencyTranslations" ("FrequencyId", "Language", "IsDefault", "Name", "CreatedAt", "UpdatedAt") VALUES
    (4, 'en', TRUE, 'Monthly', now(), now())
ON CONFLICT DO NOTHING;

-- 2. Seed Vietnamese translations

INSERT INTO "ExpenseCategoryTranslations" ("CategoryId", "Language", "IsDefault", "Name", "CreatedAt", "UpdatedAt") VALUES
    (1, 'vi', FALSE, 'Ăn uống',   now(), now()),
    (2, 'vi', FALSE, 'Di chuyển', now(), now()),
    (3, 'vi', FALSE, 'Mua sắm',   now(), now()),
    (4, 'vi', FALSE, 'Giải trí',  now(), now()),
    (5, 'vi', FALSE, 'Sức khỏe',  now(), now()),
    (6, 'vi', FALSE, 'Tiện ích',  now(), now()),
    (7, 'vi', FALSE, 'Nhà ở',     now(), now()),
    (8, 'vi', FALSE, 'Khác',      now(), now())
ON CONFLICT DO NOTHING;

INSERT INTO "ExpenseFrequencyTranslations" ("FrequencyId", "Language", "IsDefault", "Name", "CreatedAt", "UpdatedAt") VALUES
    (1, 'vi', FALSE, 'Hàng ngày', now(), now()),
    (2, 'vi', FALSE, 'Hàng tuần', now(), now()),
    (3, 'vi', FALSE, 'Hàng năm',  now(), now()),
    (4, 'vi', FALSE, 'Hàng tháng', now(), now())
ON CONFLICT DO NOTHING;
