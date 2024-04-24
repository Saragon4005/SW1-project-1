import sqlite3
from typing import Annotated

from fastapi import Cookie, FastAPI, Form, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
import new_db

app = FastAPI()

# fixed an error with the same thread being checked https://stackoverflow.com/a/48234567
new_db.script()

database = sqlite3.Connection("bank.db", check_same_thread=False)
cur: sqlite3.Cursor = database.cursor()
app.mount("/static", StaticFiles(directory="static", html=True), name="static")


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
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists"
        )
    # Insert new user into database
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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username or Password is incorrect, please try again",
        )
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
def ATMlogin(accountID: Annotated[str, Form()], pin: Annotated[str, Form()]):
    # TODO: actually validate
    return HTMLResponse(
        content="<script>location.assign('/static/atmWithdraw.html')</script>"
    )


@app.post("/admin")
def adminPost(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    user: str = Cookie(None),
):
    return {"message": "Password incorrect, please try again "}


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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username or Password is incorrect, please try again",
        )
    if userInfo[0] != user:
        return {
            "Message": "Please login with this user if you want to open an account with this user."
        }
    else:
        accounts = cur.execute(
            "SELECT * FROM accounts WHERE username=?", (user,)
        ).fetchall()
        if len(accounts) >= 3:
            return {"Message": "You cannot open any more accounts with this user"}
        response = HTMLResponse(
            "<script>location.assign('/static/confirmacct.html')</script>"
        )
        return response


@app.post("/pin")
def insert(Pin: Annotated[int, Form()], user: str = Cookie(None)):

    cur.execute("INSERT INTO accounts (username, pin) VALUES (?,?) ", (user, Pin))
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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
