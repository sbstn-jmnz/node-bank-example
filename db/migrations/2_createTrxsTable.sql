  CREATE TABLE trxs (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100),
    date timestamp NOT NULL DEFAULT NOW(),
    amount INTEGER,
    accountId INTEGER,
    FOREIGN KEY (accountId) REFERENCES accounts(id)
  )