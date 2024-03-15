CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  account_numbers TEXT  -- Store account numbers as a comma-separated string
);
CREATE TABLE admins (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL
);
CREATE TABLE accounts (
  account_number INTEGER PRIMARY KEY,
  pin INTEGER NOT NULL,
  balance REAL NOT NULL DEFAULT 0  -- Default balance starts at 0
);