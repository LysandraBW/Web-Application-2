from flask import Flask, request, render_template
from valid import *
from database.database import *
from constants import *

app = Flask(__name__)
users = Simple_Table("users")

@app.route('/')
def index():
    return render_template('createAccount.html', usernames = users.select([C_USER]))

@app.route('/createAccount', methods = ['GET', 'POST'])
def createAccount():
    if request.method == 'GET':
        return "The request method was 'GET'."
    else:
        data = request.form.to_dict()
        if good_user(data, users):
            users.insert_all((users.udomid(0, 0, 10000), data[FIRST_NAME], data[LAST_NAME], data[EMAIL_ADDRESS], 
                                data[PHONE_NUMBER], data[VIN], data[CAR_MAKE], data[CAR_MODEL], 
                                data[MODEL_YEAR], data[USERNAME], data[PASSWORD]))
            return "Good Submission"
        else:
            return "Bad Submission"

@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html', usernames = users.select([C_USER]))
    else:
        data = request.form.to_dict()
        if existing_user(data, users):
            return "Logged In"
        else:
            return render_template('login.html', accountNotFound = "true")

if __name__=='__main__':
    app.run(debug=True)