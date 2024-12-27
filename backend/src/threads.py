import sqlite3
from __main__ import app

from flask import request, jsonify

from configs import server_configs
from server_utils.server_utils import get_tripcode

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
  new_thread['id'] = cursor.lastrowid
  conn.close()
  return jsonify(new_thread), 201

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

@app.route('/threads/<int:thread_id>', methods=['DELETE'])
def delete_thread(thread_id):
  conn = sqlite3.connect('database.db')
  cursor = conn.cursor()
  cursor.execute('DELETE FROM threads WHERE id = ?', (thread_id,))
  cursor.execute('DELETE FROM comments WHERE threadId = ?', (thread_id,))
  conn.commit()
  conn.close()
  return '', 204
