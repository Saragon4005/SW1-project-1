from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from typing import Annotated
import tables
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from fastapi import FastAPI, Form
tables.Base.metadata.create_all(bind=engine)
app = FastAPI()


# opens a instance for db and closes after finished
def get_Db():
   db = SessionLocal()
   try:
      yield db
   finally:
      db.close()
   
app.mount("/static", StaticFiles(directory="static", html=True), name="static")
@app.get("/")
def root():
   return FileResponse("./static/index.html")
@app.get("/index.html")
def load():
   return FileResponse("./static/index.html")
@app.post("/register")
#Form stuff is from https://fastapi.tiangolo.com/tutorial/request-forms/
def register(username: Annotated[str, Form()], password: Annotated[str, Form()], db: Session=Depends(get_Db)):
   #you can add the database stuff here 
   data_model = tables.Customers(username=username, password=password)
   # register works 
   try:
      db.add(data_model)
      db.commit()
   except:
       return {"Error": "user already exists, please go back and try again"}
   finally:
      # reloads to index.html
      html = """<script>location.assign("/index.html")</script>"""
      return HTMLResponse(content=html)
   
@app.post("/loginPOST")
def login(username: Annotated[str, Form()], password: Annotated[str, Form()], db: Session=Depends(get_Db)):
   # you can add the database stuff here.
   results = db.get(tables.Customers, username)
   if(results == None):
      return {"message": "No username exists, please try again"}
   else:
      if(results.password == password):
         return FileResponse("./static/accountsPage")
      else:
         return {"message": "Password incorrect, please try again "}
@app.post("/adminPOST")
def adminPost(username: Annotated[str, Form()], password: Annotated[str, Form()], db: Session=Depends(get_Db)):
   results = db.get(tables.Employees, username)
   if(results == None):
      return {"message": "No username exists"}
   else:
      if(results.password == password):
         html = """<script>location.assign("./static/login.html")</script>"""
         return HTMLResponse(content=html)
      else:
         return {"message": "Password incorrect, please try again "}