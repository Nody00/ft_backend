

-- Amount column type change from string to float
-- EXPENSES TABLE
ALTER TABLE "expenses" ADD COLUMN "amount_new" FLOAT;

UPDATE "expenses" SET "amount_new"="amount"::FLOAT;

ALTER TABLE "expenses" DROP COLUMN "amount";

ALTER TABLE "expenses" RENAME COLUMN "amount_new" TO "amount";

ALTER TABLE "expenses" ALTER COLUMN "amount" SET NOT NULL;

-- INCOME TABLE
ALTER TABLE "income" ADD COLUMN "amount_new" FLOAT;

UPDATE "income" SET "amount_new"="amount"::FLOAT;

ALTER TABLE "income" DROP COLUMN "amount";

ALTER TABLE "income" RENAME COLUMN "amount_new" TO "amount";

ALTER TABLE "income" ALTER COLUMN "amount" SET NOT NULL;

-- TRANSFERS TABLE
ALTER TABLE "transfers" ADD COLUMN "amount_new" FLOAT;

UPDATE "transfers" SET "amount_new"="amount"::FLOAT;

ALTER TABLE "transfers" DROP COLUMN "amount";

ALTER TABLE "transfers" RENAME COLUMN "amount_new" TO "amount";

ALTER TABLE "transfers" ALTER COLUMN "amount" SET NOT NULL;