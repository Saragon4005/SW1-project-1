from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import Annotated

from fastapi import FastAPI, Form

app = FastAPI()

app.mount("/static", StaticFiles(directory="static", html=True), name="static")
@app.get("/")
def root():
   return FileResponse("./static/index.html")
@app.post("/register")
#Form stuff is from https://fastapi.tiangolo.com/tutorial/request-forms/
def register(username: Annotated[str, Form()], password: Annotated[str, Form()]):
   #you can add the database stuff here 
   return {"username": username, "password": password}
@app.post("/loginPOST")
def login(username: Annotated[str, Form()], password: Annotated[str, Form()]):
   # you can add the database stuff here.
   return {"username": username, "password": password }
@app.post("/adminPOST")
def adminPost(username: Annotated[str, Form()], password: Annotated[str, Form()]):
   return {"username": username, "password": password }



