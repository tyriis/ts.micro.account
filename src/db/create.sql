BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        create type transaction_type AS ENUM ('deposit', 'debit');
    END IF;
END
$$;
CREATE TABLE IF NOT EXISTS
account (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  owner BIGINT NOT NULL,
  balance NUMERIC(12, 2) DEFAULT 0,
  datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  negative BOOLEAN NOT NULL default FALSE
);

CREATE TABLE IF NOT EXISTS
account_transaction (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  account BIGINT NOT NULL REFERENCES account (id),
  datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type transaction_type NOT NULL,
  amount NUMERIC(12,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_account_transaction_account ON account_transaction (account);

COMMIT;
