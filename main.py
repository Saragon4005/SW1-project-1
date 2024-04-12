import sqlite3
from typing import Annotated

from fastapi import Cookie, FastAPI, Form, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()
# fixed an error with the same thread being checked https://stackoverflow.com/a/48234567
database = sqlite3.Connection("bank.db", check_same_thread=False)
cur: sqlite3.Cursor = database.cursor()
app.mount("/static", StaticFiles(directory="static", html=True), name="static")


@app.get("/")
@app.get("/index.html")
def root():
    return RedirectResponse("/static/index.html", status_code=301)


@app.post("/passwordError")
def load():
    html = "<script>location.assign('/static/registration.html')</script>"
    return HTMLResponse(content=html)


@app.post("/register")
# Form stuff is from https://fastapi.tiangolo.com/tutorial/request-forms/
def register(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    # you can add the database stuff here
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
        return {"Message": "Username or Password is incorrect, please try again"}
    else:
        response = HTMLResponse(
            "<script>location.assign('/static/member.html')</script>"
        )
        response.set_cookie(key="user", value=username)
        return response


@app.get("/balance")
def getBalance(user: str = Cookie(None)):
    account = cur.execute(
        "SELECT account_numbers FROM users WHERE username=?", (user,)
    ).fetchone()
    if account[0] is None:
        return {"No account exists yet"}
    else:
        # Stuff comes from the database.
        return {"Balance"}


@app.post("/ATMlogin")
def ATMlogin(accountID: Annotated[str, Form()], pin: Annotated[str, Form()]):
    # TODO: actually validate
    return HTMLResponse(
        content="<script>location.assign('/static/atmWithdraw.html')</script>"
    )


@app.post("/admin")
def adminPost(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    return {"message": "Password incorrect, please try again "}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
