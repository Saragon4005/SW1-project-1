import json
import sqlite3
from typing import Annotated


from fastapi import Cookie, FastAPI, Form
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi import Body
import new_db

app = FastAPI()

# fixed an error with the same thread being checked https://stackoverflow.com/a/48234567
new_db.script()
database = sqlite3.Connection("bank.db", check_same_thread=False)
cur = database.cursor()
app.mount("/static", StaticFiles(directory="static", html=True), name="static")


def errorPage(message: str) -> HTMLResponse:
    return HTMLResponse(
        content=f"<script> alert('{message}'); history.back();</script>"
    )


@app.get("/")
@app.get("/index.html")
def root():
    return RedirectResponse("/static/index.html", status_code=301)


@app.post("/pinError")
def redirectPinError():
    html = "<script>location.assign('/static/confirmacct.html')</script>"
    return HTMLResponse(content=html)


@app.post("/openError")
def redirectOpenError():
    html = "<script>location.assign('/static/openAccount.html')</script>"
    return HTMLResponse(content=html)


@app.post("/passwordError")
def redirectPasswordError():
    html = "<script>location.assign('/static/registration.html')</script>"
    return HTMLResponse(content=html)


@app.post("/register")
# Form stuff is from https://fastapi.tiangolo.com/tutorial/request-forms/
def register(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
):
    user = cur.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    if user:
        return errorPage("Username already exists")
    else:
        cur.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)", (username, password)
        )
        database.commit()
        html = "<script>location.assign('/index.html')</script>"
        return HTMLResponse(content=html)


@app.post("/login")
def login(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    # Cookie deleting, reading, and setting up from https://www.getorchestra.io/guides/fast-api-response-cookies-a-detailed-tutorial-with-python-code-examples
    user = cur.execute(
        "SELECT * FROM users WHERE username = ? and password = ?", (username, password)
    ).fetchone()

    if user is None:
        return errorPage("Username or Password is incorrect, please try again")
    else:
        response = HTMLResponse(
            "<script>location.assign('/static/member.html')</script>"
        )
        response.set_cookie(key="user", value=username)
        return response


@app.get("/balance")
def getBalance(user: str = Cookie(None)):
    accounts: list[tuple[int, float]] = cur.execute(
        "SELECT `account_number`, `balance` FROM accounts WHERE username=?", (user,)
    ).fetchall()
    if len(accounts) == 0:
        # this one has to be json
        return {"No account exists"}
    else:
        string = ""
        for i, account in enumerate(accounts):
            id = str(account[0])
            balance = "$" + str(account[1])
            if i == 0:
                string = id + ":" + balance
            else:
                string += " " + id + ":" + balance
    return {string}


@app.post("/ATMlogin")
def ATMlogin(accountID: Annotated[str, Form()], atmPIN: Annotated[str, Form()]):

    account = cur.execute(
        "SELECT * FROM accounts WHERE account_number = ? and pin = ?",
        (accountID, atmPIN),
    ).fetchone()

    if account is None:
        return errorPage("Account Number or Pin is incorrect, please try again")
    else:
        response = HTMLResponse(
            content="<script>location.assign('/static/atmWithdraw.html')</script>"
        )
        response.set_cookie(key="currentAccountNumber", value=accountID)
        return response


@app.get("/getWithdrawBalance")
def withdrawBalance(currentAccountNumber: int = Cookie(None)):
    balance = cur.execute(
        "SELECT balance FROM accounts WHERE account_number=?", (currentAccountNumber,)
    ).fetchone()
    return json.dumps(
        {"accountNumber": str(currentAccountNumber), "balance": str(balance[0])},
        separators=(", ", ":"),
    )


@app.post("/withdraw")
def withdraw(
    amount: Annotated[float, Form()], currentAccountNumber: int = Cookie(None)
):
    balance = cur.execute(
        "SELECT balance FROM accounts WHERE account_number=?", (currentAccountNumber,)
    ).fetchone()
    if amount < 0.01:
        return errorPage("Withdraw amount must be at least $0.01")
    if amount > balance[0]:
        return errorPage("Balance insufficient")
    else:
        newBalance = balance[0] - amount
        cur.execute(
            "UPDATE accounts SET balance=? WHERE account_number=?",
            (newBalance, currentAccountNumber),
        )
        database.commit()
        response = HTMLResponse(
            "<script>location.assign('/static/atmAfterWithdraw.html')</script>"
        )
        return response


@app.post("/setCheckCookie")
# receving fetch data in fastapi https://stackoverflow.com/a/73761724
def checkAccount(accountNum: str = Body()):
    response = JSONResponse("cookie")
    response.set_cookie(key="check", value=accountNum)
    return response


@app.post("/checkAmount")
def update(amount: Annotated[float, Form()], check: int = Cookie(None)):
    if amount < 0.01:
        return errorPage("Deposit amount must be at least $0.01")
    currentAmount = cur.execute(
        "SELECT balance FROM accounts WHERE account_number=?", (check,)
    ).fetchone()
    input = amount
    amount = currentAmount[0] + amount
    cur.execute("UPDATE accounts SET balance=? WHERE account_number=?", (amount, check))
    database.commit()
    response = HTMLResponse(
        content="<script>location.assign('/static/successfulcheckdeposit.html')</script>"
    )
    response.set_cookie(key="amount", value=input)  # type: ignore
    return response


@app.get("/getCheckData")
def getCheckData(amount: str = Cookie(None), check: str = Cookie(None)):
    return {check + "," + amount}


@app.post("/admin")
def adminPost(
    employeeUsername: Annotated[str, Form()], empPassword: Annotated[str, Form()]
):
    admin = cur.execute(
        "SELECT * FROM admins WHERE username = ? and password = ?",
        (employeeUsername, empPassword),
    ).fetchone()

    if admin is None:
        return errorPage("Username or Password is incorrect, please try again")
    else:
        response = HTMLResponse(
            "<script>location.assign('/static/adminMain.html')</script>"  # TODO: change to admin page
        )
        response.set_cookie(key="admin", value=employeeUsername)
        return response


@app.post("/openAccount")
def open(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    user: str = Cookie(None),
):
    userInfo = cur.execute(
        "SELECT * FROM users WHERE username = ? and password = ?", (username, password)
    ).fetchone()
    if userInfo is None:
        return errorPage("Username or Password is incorrect, please try again")
    if userInfo[0] != user:
        return errorPage(
            "Please login with this user if you want to open an account with this user."
        )
    else:
        accounts = cur.execute(
            "SELECT * FROM accounts WHERE username=?", (user,)
        ).fetchall()
        if len(accounts) >= 3:
            return errorPage("You cannot open any more accounts with this user")
        response = HTMLResponse(
            "<script>location.assign('/static/createPIN.html')</script>"
        )
        return response


@app.post("/closeAccount")
def closeAccount(
    username: Annotated[str, Form()],
    accountID: Annotated[int, Form()],
    oldPin: Annotated[int, Form()],
):
    account = cur.execute(
        "SELECT username, account_number, pin, balance FROM accounts WHERE username=? AND account_number=? AND pin=?",
        (username, accountID, oldPin),
    ).fetchone()
    if account is None:
        return errorPage(
            "Account Number, username or Pin is incorrect, please try again"
        )
    if (balance := account[3]) > 0.01:
        return errorPage(
            f"Account has ${balance}, please empty account before deleting it"
        )
    if account[0] != username:
        return errorPage(
            "Please login with the user which owns the account to close it."
        )
    cur.execute(
        "DELETE FROM accounts WHERE username=? AND account_number=? AND pin=?",
        (username, accountID, oldPin),
    )
    database.commit()
    response = HTMLResponse("<script>location.assign('/static/member.html')</script>")
    return response


@app.post("/pin")
def insert(pin: Annotated[int, Form()], user: str = Cookie(None)):

    cur.execute("INSERT INTO accounts (username, pin) VALUES (?,?) ", (user, pin))
    database.commit()
    # This get the last account inserted
    accountsNumber = cur.execute(
        # SQL query adapted from https://stackoverflow.com/a/16043791/23765485
        "SELECT account_number FROM accounts ORDER BY account_number DESC"
    ).fetchone()
    response = HTMLResponse(
        "<script>location.assign('/static/generateAccountNumber.html')</script>"
    )
    response.set_cookie(key="currentAccountNumber", value=accountsNumber[0])
    return response


@app.get("/accountID")
def getAccountID(currentAccountNumber: str = Cookie(None)):
    return {currentAccountNumber}


@app.post("/cancelTransfer")
def cancel():
    response = HTMLResponse("<script>location.assign('/static/member.html')</script>")
    return response


@app.get("/getTransferData")
def getTransferData(amount: str = Cookie(None), recipient: str = Cookie(None)):
    return {recipient + "," + amount}


@app.post("/transfer")
def transfer(
    accountSelect: Annotated[int, Form()],
    transferPin: Annotated[int, Form()],
    ammttp: Annotated[float, Form()],
    recipientacctnum: Annotated[int, Form()],
):
    if ammttp < 0.01:
        return errorPage("Transfer amount must be at least $0.01")
    balance = cur.execute(
        "SELECT balance FROM accounts WHERE account_number=? AND pin=?",
        (accountSelect, transferPin),
    ).fetchone()
    if recipientacctnum == accountSelect:
        return errorPage("Recipient and source cannot be the same.")
    if balance is None:
        return errorPage("pin was incorrect, go back and enter correct pin")

    if ammttp > balance[0]:
        return errorPage("Balance insufficient, go back and try again")

    recipientBalance = cur.execute(
        "SELECT balance FROM accounts WHERE account_number=?", (recipientacctnum,)
    ).fetchone()

    if recipientBalance is None:
        return errorPage(
            "Recipient account does not exist, go back and enter correct number"
        )

    else:
        newRecBalance = recipientBalance[0] + ammttp
        try:
            cur.execute(
                "UPDATE accounts SET balance=? WHERE account_number=?",
                (newRecBalance, recipientacctnum),
            )
            newBalance = balance[0] - ammttp
            cur.execute(
                "UPDATE accounts SET balance=? WHERE account_number=?",
                (newBalance, accountSelect),
            )
            database.commit()
        except sqlite3.Error as e:
            database.rollback()
            raise e
        response = HTMLResponse(
            "<script>location.assign('/static/successfulfundtransfer.html')</script>"
        )
        response.set_cookie(key="recipient", value=recipientacctnum)  # type: ignore
        response.set_cookie(key="amount", value=ammttp)  # type: ignore
        return response


@app.get("/getCustomerData")
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
    # Creating a string in JSON format, so that I can parse it using JSON.parse() and split with semicolons in javascript.
    dataString += formattedString
    return dataString


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app=app, host="127.0.0.1", port=8000)
