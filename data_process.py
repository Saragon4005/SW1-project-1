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
    for user in users.keys():
         currentList = users[user]
         userAccounts = len(currentList)
         userTotalBalance = 0
         stro = ""
         for tup in currentList:
             stro += "({0},{1})".format(tup[0], tup[1]) + " "
             userTotalBalance += tup[1]
         totalsString = "({0},{1})".format(userAccounts, userTotalBalance)
         string = '"username":"{use}", "accounts":"{accounts}", "totals":"{totals}"'
         stro = stro.strip()
         formattedString = "{" + string.format(use=user, accounts=stro, totals=totalsString) + "}"
         dataString += formattedString + ";"
    constantsString = '"numOfaccounts":"{0}", "totalBalance":"{1}", "largestAccountNum":"{2}"'
    formattedString = "{" + constantsString.format(numOfaccounts, totalBalance, largestAccountNum) + "}"
    dataString += formattedString + ";"
    print(dataString)
    return (
        users,
        numOfaccounts,
        largestAccountNum,
        totalBalance,
    )

generateStats()
