CREATE TABLE
  users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
  );

CREATE TABLE
  admins (username TEXT PRIMARY KEY, password TEXT NOT NULL);

CREATE TABLE
  accounts (
    account_number INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    pin  INTEGER NOT NULL,
    balance REAL NOT NULL DEFAULT 0 -- Default balance starts at 0
  );

INSERT INTO users (username, password) VALUES ("Sza","1234");
INSERT INTO users (username, password) VALUES ("test1","asd");
INSERT INTO accounts (username, pin, balance) VALUES ('Sza',1234,100);
