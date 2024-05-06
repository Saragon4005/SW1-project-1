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


def generateStats():
    accounts: list[tuple[int, str, int, float]] = cur.execute(
        "SELECT account_number, username, pin, balance FROM accounts"
    ).fetchall()
    users: dict[str, tuple[int, float]] = {}
    numOfaccounts = len(accounts)
    largestAccountNum = 0
    totalBalance = 0.0
    for account in accounts:
        if account[0] > largestAccountNum:
            largestAccountNum = account[0]
        totalBalance += account[3]
        user = users.get(account[1], (0, 0.0))
        users[account[1]] = (user[0] + 1, user[1] + account[3])

    return (
        users,
        numOfaccounts,
        largestAccountNum,
        totalBalance,
    )
