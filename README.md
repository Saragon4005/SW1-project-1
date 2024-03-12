# SW1-project-1

## Installing

This is building for Python 3.11
Assuming python and pip is installed the libraries can be installed with `pip install -r requirements.txt`

### Initialize the Database

If the databse doesn't exist, run the sql quaries in `create.sql`.
Important to note, employee logins need to be added manually

## Running

Fast API starts a self updating web server with the command `uvicorn main:app --reload`
A web server will track the updates in real time
