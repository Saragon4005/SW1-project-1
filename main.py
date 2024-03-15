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


@app.get("/register")
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
    return {"message": "Registration successful"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
