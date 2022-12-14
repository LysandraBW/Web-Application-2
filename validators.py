from email_validator import validate_email, EmailNotValidError
from re import IGNORECASE, findall, compile
from constants import *

#BIG BOSS:
#Input is sent here to be validated. Input is sent elsewhere from here to be validated. Information comes back to go back.
def validate(name, value, options = None):
    check = {
        FIRST_NAME: v_name,
        LAST_NAME: v_name,
        PHONE_NUMBER: v_phone,
        EMAIL_ADDRESS: v_email,
        USERNAME: v_username,
        PASSWORD: v_password,
        VIN: v_vin,
        CAR_MAKE: v_make,
        CAR_MODEL: v_model,
        MODEL_YEAR: v_year
    }

    #Some inputs need to be checked against other values, so they'll need additional input (passed in via options param).
    if options is None:
        return check[name](value)
    return check[name](value, options)

#HELPER FUNCTIONS:
#If the regex is found in the value, a True is returned. Else, False is returned.
def found(regex, value):
    return len(findall(regex, value)) > 0

#Specifically, if there are no spaces in the value, a True is returned. False otherwise.
def no_spaces(value):
    return not found(compile("[\s]"), value)

#VALIDATING FUNCTIONS:
#The functions below are used to verify the validity of a certain type of input. 
#True is returned if the input is valid, and False is returned if the input is invalid.
def v_name(name):
    return not found(compile("[^a-z \-`']", IGNORECASE), name) and len(name.strip()) > 0

def v_phone(phone):
    return found(compile("\d{3}-\d{3}-\d{4}"), phone) and len(phone) == 12

def v_username(username, existing_usernames):
    return len(username) > 0 and no_spaces(username) and not username.lower() in map(str.lower, existing_usernames)

def v_password(password):
    return found(compile("[A-Z]"), password) and found(compile("[a-z]"), password) and found(compile("[\d]"), password) and no_spaces(password) and len(password) >= 5

def v_vin(vin):
    return not found(compile("[OIQ]", IGNORECASE), vin) and not found(compile("[\W\s]"), vin) and len(vin) == 17

def v_make(make, makes):
    return make.lower() in map(str.lower, makes)

def v_model(model, models):
    return model.lower() in map(str.lower, models)

def v_year(year, years):
    return int(years[0]) <= int(year) <= int(years[1])

def v_email(email):
    try:
        validate_email(email)
        return True
    except EmailNotValidError:
        return False