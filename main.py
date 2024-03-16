from fastapi import FastAPI, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
import sqlite3


app = FastAPI()

database = sqlite3.Connection("bank.db")
cur: sqlite3.Cursor = database.cursor()


@app.get("/")
@app.get("/index.html")
async def root():
    return RedirectResponse("static/index.html", 301)


app.mount("/static", StaticFiles(directory="static"), name="static")


@app.post("/register")
async def register(username: str, password: str):
    # Check for existing username
    user = cur.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists"
        )
    # Insert new user into database
    cur.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)", (username, password)
    )
    database.commit()
    return RedirectResponse(
        "static/login.html", 303
    )  # tell browser to redirect to login 303 means redirected to confirmation page


@app.post("/login")
async def login(username: str, password: str):
    # Check for username and password combination
    user = cur.execute(
        "SELECT * FROM users WHERE username = ? and password = ?", (username, password)
    ).fetchone()
    if user:
        return {"message": "Login sucess, not yet implemented"}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Username or password doesn't match",
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
