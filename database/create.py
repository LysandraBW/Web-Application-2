import sqlite3

conn = sqlite3.connect("database/users.sqlite")
cursor = conn.cursor()
query = """ CREATE TABLE users (
    id integer UNIQUE,
    first_name text,
    last_name text,
    email text,
    phone_number text,
    vin text,
    car_make text,
    car_model text,
    model_year integer,
    username text UNIQUE,
    password text
)"""
cursor.execute(query)