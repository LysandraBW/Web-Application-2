from numpy import array
from constants import *
from database.database import *
#Turn import * to import validate
from validators import *

def good_user(data, table):
    #figure out why this isnt working properly
    _data = {
        FIRST_NAME: data[FIRST_NAME],
        LAST_NAME: data[LAST_NAME],
        PHONE_NUMBER: data[PHONE_NUMBER],
        EMAIL_ADDRESS: data[EMAIL_ADDRESS],
        USERNAME: [data[USERNAME], array(table.select([C_USER])).flatten()],
        PASSWORD: data[PASSWORD],
        VIN: data[VIN],
        CAR_MAKE: [data[CAR_MAKE], data[ALL_MAKES].split(",")],
        CAR_MODEL: [data[CAR_MODEL], data[ALL_MODELS].split(",")],
        MODEL_YEAR: [data[MODEL_YEAR], data[ALL_YEARS].split()]
    }
    
    compared = [USERNAME, CAR_MAKE, CAR_MODEL, MODEL_YEAR] #These values are compared against other values, so the extra information needs to be sent as well

    #CHECKING
    for name in _data:
        if name in compared:
            if not validate(name, _data[name][0], _data[name][1]):
                print("Invalid: " + name)
                return False
        elif not validate(name, _data[name]):
            print("Invalid: " + name)
            return False
    return True

def existing_user(data, table):
    user = table.select([C_USER, C_PASS], USERNAME + " = ?", (data[USERNAME],))
    if user is None:
        return False
    if data[PASSWORD] == user[0][1]:
        return True
    return False

