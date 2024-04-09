from fastapi import FastAPI, HTTPException, status, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from typing import Annotated
import sqlite3

app = FastAPI()
# fixed an error with the same thread being checked https://stackoverflow.com/a/48234567
database = sqlite3.Connection("bank.db", check_same_thread=False)
cur: sqlite3.Cursor = database.cursor()
app.mount("/static", StaticFiles(directory="static", html=True), name="static")
@app.get("/")
@app.get("/index.html")
def root():
    return FileResponse("./static/index.html")
@app.get("/index.html")
def load():
    return FileResponse("./static/index.html")
@app.post("/passwordError")
def load():
    html = "<script>location.assign('/static/registration.html')</script>"
    return HTMLResponse(content=html)
@app.post("/register")
# Form stuff is from https://fastapi.tiangolo.com/tutorial/request-forms/
def register(username: Annotated[str, Form()], password: Annotated[str, Form()],):
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
    user = cur.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    if user == None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username or Password is wrong",
        )
    else:
        return HTMLResponse(
            content="<script>location.assign('/static/member.html')</script>"
        )


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
