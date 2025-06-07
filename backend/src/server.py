from flask import Flask
from flask_cors import CORS
import sqlite3
from configs import server_configs
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from tags import app as tags_app
from tags import app_limited as tags_app_limited

from comments import app as comments_app
from comments import app_limited as comments_app_limited

from threads import app as threads_app
from threads import app_limited as threads_app_limited

from images import app as images_app
from images import app_limited as images_app_limited

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:*"}})

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[],
    storage_uri="memory://"
)

def init_db():
    conn = sqlite3.connect(server_configs['db_path'])
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author TEXT NOT NULL REFERENCES users(tripcode),
            content TEXT NOT NULL,
            date TEXT NOT NULL,
            feverCount INTEGER NOT NULL,
            threadId INTEGER NOT NULL REFERENCES threads(id),
            imageId INTEGER REFERENCES images(id),
            parentId INTEGER REFERENCES comments(id)
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS threads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL REFERENCES users(tripcode),
            date TEXT NOT NULL,
            description TEXT NOT NULL,
            imageId INTEGER REFERENCES images(id),
            fever INTEGER NOT NULL DEFAULT 0
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tripcode TEXT NOT NULL,
            email TEXT NOT NULL,
            friendlyname TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS thread_images (
            threadId INTEGER NOT NULL REFERENCES threads(id),
            imageId INTEGER NOT NULL REFERENCES images(id),
            PRIMARY KEY (threadId, imageId)
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    ''')
    cursor.execute('''
      CREATE TABLE IF NOT EXISTS thread_tags (
            threadId INTEGER NOT NULL REFERENCES threads(id),
            tagId INTEGER NOT NULL REFERENCES tags(id),
            PRIMARY KEY (threadId, tagId)
        )''')
    conn.commit()
    conn.close()

#setup rate limiting
limiter.limit(server_configs['rate_limit'])(tags_app_limited)
limiter.limit(server_configs['rate_limit'])(comments_app_limited)
limiter.limit(server_configs['rate_limit'])(threads_app_limited)
limiter.limit(server_configs['rate_limit'])(images_app_limited)

# Register blueprints for each module
app.register_blueprint(tags_app)
app.register_blueprint(tags_app_limited)
app.register_blueprint(comments_app)
app.register_blueprint(comments_app_limited)
app.register_blueprint(threads_app)
app.register_blueprint(threads_app_limited)
app.register_blueprint(images_app)
app.register_blueprint(images_app_limited)


def run():
  init_db()
  app.run()

# if __name__ == '__main__':
#   run()
