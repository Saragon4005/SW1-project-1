import os
import sqlite3

if os.path.exists("bank.db"):
    print("bank.db Database file already exists")
    if input("Do you want to delete current database? (N/y) ").lower() == "y":
        os.remove("bank.db")
        print("Old database has been erased")
    else:
        print("No changes made, exiting")
        exit()

print("Attempting to create new database")

conn = sqlite3.Connection("bank.db", check_same_thread=False)

with open("create.sql", "r") as sql_file:
    conn.executescript(sql_file.read())

conn.close()
