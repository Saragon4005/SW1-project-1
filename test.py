import sqlite3

db = sqlite3.Connection("bank.db", check_same_thread=False)

cursor = db.cursor()

balance = cursor.execute("SELECT balance From accounts WHERE username='Sza'").fetchone()

print(balance[0])


