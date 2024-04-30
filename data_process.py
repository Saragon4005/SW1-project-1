import sqlite3


def setDB(c: sqlite3.Connection) -> None:
    global conn
    conn = c
    global cur
    cur = conn.cursor()


setDB(sqlite3.Connection("bank.db", check_same_thread=False))


def getAccounts(user: str) -> list[int]:
    accounts: list[tuple[int]] = cur.execute(
        "SELECT `account_number` FROM accounts WHERE username=?", (user,)
    ).fetchall()
    out: list[int] = [a[0] for a in accounts]
    return out
