CREATE TABLE accounts(
  id SERIAL PRIMARY KEY,
  balance INTEGER CHECK (balance >= 0)
)