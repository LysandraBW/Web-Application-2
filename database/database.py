import sqlite3
import random
    
def db_conn(file_name):
    conn = None
    try:
        conn = sqlite3.connect("database/"+file_name+".sqlite")
    except sqlite3.error as e:
        print(e)
    return conn

class Simple_Table:
    def __init__(self, _name):
        self.conn = db_conn(_name)
        self.name = _name
        curs = self.conn.execute("SELECT * FROM " + _name)
        self.column_names = list(map(lambda x: x[0], curs.description))

    def select(self, column_indexes, constraint = None, values = None):
        self.conn = db_conn(self.name)
        result = None
        s_command = "SELECT "
        length = len(column_indexes)
        if length <= 0:
            s_command += "* "
        else:
            for index, i in enumerate(column_indexes):
                s_command += self.column_names[i]
                if index < length - 1:
                    s_command += ","
        s_command += " FROM " + self.name
        if constraint != None:
            s_command += " WHERE " + constraint
        if values != None:
            result = self.conn.execute(s_command, values).fetchall()
        else:
            result = self.conn.execute(s_command).fetchall()
        return self.to_arr(result)
    
    def insert(self, column_indexes, values):
        curs = self.conn.cursor()
        length = len(column_indexes)
        s_command = "INSERT INTO " + self.name + "("
        for i in column_indexes:
            s_command += self.column_names[i]
            if i == length - 1:
                s_command += ")"
            else:
                s_command += ","
        s_command += " VALUES (" + ("?," * (length - 1)) + "?)"
        curs.execute(s_command, values)
        self.conn.commit()

    def insert_all(self, values):
        self.insert(list(range(0, len(self.column_names))), values)

    def update(self, column_indexes, constraint, values):
        curs = self.conn.cursor()
        s_command = "UPDATE " + self.name + " SET "
        length = len(column_indexes)
        for i in column_indexes:
            s_command += self.column_names[i]
            if i == length - 1:
                s_command += " = ? "
            else:
                s_command += " = ?, "
        if constraint != None:
            s_command += " WHERE " + constraint
        curs.execute(s_command, values)
        self.conn.commit()
    
    def delete(self, constraint, values):
        curs = self.conn.cursor()
        s_command = "DELETE FROM " + self.name + " WHERE " + constraint
        if values != None:
            curs.execute(s_command, values)
        else:
            curs.execute(s_command)
        self.conn.commit()

    def has(self, column_indexes, constraint, values):
        return not self.select(column_indexes, constraint, values) == None

    def to_arr(self, arr):
        if arr == None or len(arr) == 0:
            return None
        
        l = [[0] * len(arr[0]) for i in range(len(arr))]
        for i, inner_array in enumerate(arr):
            for n, inner_element in enumerate(inner_array):
                l[i][n] = inner_element
        return l

    def udomid(self, column_index, minimum, maximum):
        rand = random.randint(minimum, maximum)
        while self.has([column_index], self.column_names[column_index] + " = ?", (rand,)):
            rand = random.randint(minimum, maximum)
        return rand