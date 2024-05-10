import json
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
    users: dict[str, list[tuple[int, float]]] = {}
    numOfaccounts = len(accounts)
    largestAccountNum = 0
    totalBalance = 0.0
    for account in accounts:
        if account[0] > largestAccountNum:
            largestAccountNum = account[0]
        totalBalance += account[3]
        user = users.get(account[1], [])
        user.append((account[0], account[3]))
        users[account[1]] = user

    dataString = ""
    userAccounts = 0

    for user, currentList in users.items():
        userAccounts = len(currentList)
        userTotalBalance = 0
        for tup in currentList:
            userTotalBalance += tup[1]

        stro1 = " ".join([f"({tup[0]},{tup[1]})" for tup in currentList])

        dataString += (
            json.dumps(
                {
                    "username": user,
                    "accounts": stro1,
                    "totals": str((userAccounts, userTotalBalance)).replace(" ", ""),
                },
                separators=(", ", ":"),
            )
            + ";"
        )

    formattedString = json.dumps(
        {
            "numOfaccounts": str(numOfaccounts),
            "totalBalance": str(totalBalance),
            "largestAccountNum": str(largestAccountNum),
        },
        separators=(", ", ":"),
    )
    dataString += formattedString + ";"
    print(dataString)
    return (
        users,
        numOfaccounts,
        largestAccountNum,
        totalBalance,
    )


generateStats()

"""
{"username":"Sza", "accounts":"(1,9261.0) (3,123.01)", "totals":"(2,9384.01)"};{"numOfaccounts":"2", "totalBalance":"9384.01", "largestAccountNum":"3"};
"""
