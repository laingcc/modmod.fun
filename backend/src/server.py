from flask import Flask, request, jsonify
import sqlite3

from server_utils.server_utils import get_tripcode
from configs import *

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author TEXT NOT NULL,
            content TEXT NOT NULL,
            date TEXT NOT NULL,
            feverCount INTEGER NOT NULL,
            threadId INTEGER NOT NULL REFERENCES threads(id)
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS threads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            date TEXT NOT NULL,
            description TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Feature Imports
import comments
import threads

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
