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

@app.route('/threads', methods=['GET'])
def get_threads():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM threads')
    threads = cursor.fetchall()
    conn.close()
    return jsonify([{
        'id': t[0],
        'title': t[1],
        'author': t[2],
        'date': t[3],
        'description': t[4]
    } for t in threads])

@app.route('/threads/<int:thread_id>', methods=['GET'])
def get_thread(thread_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM threads WHERE id = ?', (thread_id,))
    thread = cursor.fetchone()
    cursor.execute('SELECT * FROM comments WHERE threadId = ?', (thread_id,))
    comments = cursor.fetchall()
    conn.close()
    return jsonify({
        'id': thread[0],
        'title': thread[1],
        'author': thread[2],
        'date': thread[3],
        'description': thread[4],
        'comments': [{
            'id': c[0],
            'author': c[1],
            'content': c[2],
            'date': c[3],
            'feverCount': c[4]
        } for c in comments]})

@app.route('/threads', methods=['POST'])
def create_thread():
    new_thread = request.get_json()
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO threads (title, author, date, description) VALUES (?, ?, ?, ?)',
                   (new_thread['title'],get_tripcode(new_thread['author'], server_configs['salt']), new_thread['date'], new_thread['description']))
    conn.commit()
    conn.close()
    return jsonify(new_thread), 201

@app.route('/threads/<int:thread_id>/comments', methods=['POST'])
def create_comment(thread_id):
    new_comment = request.get_json()
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO comments (author, content, date, feverCount, threadId) VALUES (?, ?, ?, ?, ?)',
                   (get_tripcode(new_comment['author'], server_configs['salt']), new_comment['content'], new_comment['date'], 0, thread_id))
    conn.commit()
    conn.close()
    return jsonify(new_comment), 201

@app.route('/threads/<int:thread_id>', methods=['PUT'])
def update_thread(thread_id):
    updated_thread = request.get_json()
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # Fetch the existing thread
    cursor.execute('SELECT author FROM threads WHERE id = ?', (thread_id,))
    existing_thread = cursor.fetchone()

    if existing_thread is None or get_tripcode(updated_thread['author'], server_configs['salt']) != existing_thread[0]:
      conn.close()
      return jsonify({'error': 'Unauthorized'}), 403

    cursor.execute('UPDATE threads SET title = ?, author = ?, date = ? WHERE id = ?',
                   (updated_thread['title'], updated_thread['author'], updated_thread['date'], thread_id))
    conn.commit()
    conn.close()
    return jsonify(updated_thread)

@app.route('/threads/<int:thread_id>/comments/<int:comment_id>', methods=['PUT'])
def update_comment(thread_id, comment_id):
    updated_comment = request.get_json()

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # Fetch the existing comment
    cursor.execute('SELECT author FROM comments WHERE id = ? AND threadId = ?', (comment_id, thread_id))
    existing_comment = cursor.fetchone()

    if existing_comment is None or get_tripcode(updated_comment['author'], server_configs['salt']) != existing_comment[0]:
      conn.close()
      return jsonify({'error': 'Unauthorized'}), 403

    cursor.execute('UPDATE comments SET author = ?, content = ?, date = ?, feverCount = ? WHERE id = ? AND threadId = ?',
                   (updated_comment['author'], updated_comment['content'], updated_comment['date'], updated_comment['feverCount'], comment_id, thread_id))
    conn.commit()
    conn.close()
    return jsonify(updated_comment)

@app.route('/threads/<int:thread_id>', methods=['DELETE'])
def delete_thread(thread_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM threads WHERE id = ?', (thread_id,))
    cursor.execute('DELETE FROM comments WHERE threadId = ?', (thread_id,))
    conn.commit()
    conn.close()
    return '', 204

@app.route('/threads/<int:thread_id>/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(thread_id, comment_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM comments WHERE id = ? AND threadId = ?', (comment_id, thread_id))
    conn.commit()
    conn.close()
    return '', 204

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
