import sqlite3

conn = sqlite3.Connection("bank.db")
cur = conn.cursor()
user = "Sza"
row = cur.execute("SELECT * FROM users WHERE username= ?", (user,))
tuple = row.fetchone()
print(tuple[1])
