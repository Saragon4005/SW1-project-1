# SW1-project-1

## Installing

This is building for Python 3.11
Assuming python and pip is installed the libraries can be installed with `pip install -r requirements.txt`

### Initialize the Database

The app uses a file named `bank.db` as a sqlite3 db
If this database doesn't exist running the app will automatically create one based on sql queries in `create.sql`.
The database can also be manually created over reset to default by running the `new_db.py` Python script
There are default values for 1 user with 2 accounts and 1 employee account
The employee account has the username of admin and password of admin1

## Running

Running the `main.py` file using python will start the server
The Fast API can be started manually as a self updating web server with the command `uvicorn main:app --reload`
Unlike with running `main.py` the server will track the updates to files in real time
