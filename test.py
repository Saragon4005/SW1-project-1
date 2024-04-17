import sqlite3

db = sqlite3.Connection("bank.db", check_same_thread=False)
cur = db.cursor()

username = "Sza"
pin = 1234
balance = 5.0

accounts = cur.execute(
print(len(accounts))
db.commit()


