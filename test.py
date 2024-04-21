import sqlite3

db = sqlite3.Connection("bank.db", check_same_thread=False)

cursor = db.cursor()

print(cursor.execute("SELECT account_number FROM accounts ORDER BY account_number DESC").fetchone())



