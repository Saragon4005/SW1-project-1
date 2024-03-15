from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi import FastAPI, HTTPException, status, Form
from typing import Annotated
import sqlite3
app = FastAPI()
# fixed an error with the same thread being checked https://stackoverflow.com/a/48234567
database = sqlite3.Connection("bank.db", check_same_thread=False)
cur: sqlite3.Cursor = database.cursor()
app.mount("/static", StaticFiles(directory="static", html=True), name="static")
@app.get("/")
def root():
   return FileResponse("./static/index.html")
@app.get("/index.html")
def load():
   return FileResponse("./static/index.html")
@app.post("/register")
#Form stuff is from https://fastapi.tiangolo.com/tutorial/request-forms/
def register(username: Annotated[str, Form()], password: Annotated[str, Form()]):
   #you can add the database stuff here 
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
   html = "<script>location.assign('/index.html')</script>"
   return HTMLResponse(content=html)
@app.post("/loginPOST")
def login(username: Annotated[str, Form()], password: Annotated[str, Form()]):
   # db.get(table, "name of primary key") from the sqlachemy docs
     user = cur.execute("SELECT * FROM users WHERE username = ?",(username,)).fetchone()
     if(user == None):
          raise HTTPException(
               status_code=status.HTTP_400_BAD_REQUEST, detail="Username does not exist"
          )
     else:
          tuple = user
          if(tuple[1] == password):
               return{"Message": "Success"}
     return {"username": username, "password": password}
@app.post("/adminPOST")
def adminPost(username: Annotated[str, Form()], password: Annotated[str, Form()]):
         return {"message": "Password incorrect, please try again "}