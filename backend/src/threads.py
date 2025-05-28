import sqlite3
from __main__ import app

from flask import request, jsonify

from configs import server_configs
from server_utils.server_utils import get_tripcode

from __main__ import limiter

@app.route('/threads', methods=['GET'])
def get_threads():
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM threads')
        threads = cursor.fetchall()

        thread_data = []
        for t in threads:
            cursor.execute('SELECT imageId FROM thread_images WHERE threadId = ?', (t[0],))
            image_ids = [row[0] for row in cursor.fetchall()]
            thread_data.append({
                'id': t[0],
                'title': t[1],
                'author': t[2],
                'date': t[3],
                'description': t[4],
                'fever': t[5],
                'imageIds': image_ids
            })

    return jsonify(thread_data)

@app.route('/threads/<int:thread_id>', methods=['GET'])
def get_thread(thread_id):
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM threads WHERE id = ?', (thread_id,))
        thread = cursor.fetchone()

        cursor.execute('SELECT imageId FROM thread_images WHERE threadId = ?', (thread_id,))
        image_ids = [row[0] for row in cursor.fetchall()]

        cursor.execute('SELECT * FROM comments WHERE threadId = ?', (thread_id,))
        comments = cursor.fetchall()

    return jsonify({
        'id': thread[0],
        'title': thread[1],
        'author': thread[2],
        'date': thread[3],
        'description': thread[4],
        'fever': thread[5],
        'imageIds': image_ids,
        'comments': [{
            'id': c[0],
            'author': c[1],
            'content': c[2],
            'date': c[3],
            'feverCount': c[4],
            'parentId': c[7]
        } for c in comments]
    })

@app.route('/threads', methods=['POST'])
@limiter.limit(server_configs['rate_limit'])
def create_thread():
    new_thread = request.get_json()
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO threads (title, author, date, description, fever) VALUES (?, ?, ?, ?, ?)',
                       (new_thread['title'], get_tripcode(new_thread['author'], server_configs['salt']), new_thread['date'], new_thread['description'], 0))
        thread_id = cursor.lastrowid

        for image_id in new_thread['imageIds']:
            cursor.execute('INSERT INTO thread_images (threadId, imageId) VALUES (?, ?)', (thread_id, image_id))

        conn.commit()

    new_thread['id'] = thread_id
    return jsonify(new_thread), 201

@app.route('/threads/<int:thread_id>', methods=['PUT'])
def update_thread(thread_id):
    updated_thread = request.get_json()['thread']
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT author FROM threads WHERE id = ?', (thread_id,))
        existing_thread = cursor.fetchone()

        if existing_thread is None or get_tripcode(updated_thread['author'], server_configs['salt']) != existing_thread[0]:
            return jsonify({'error': 'Unauthorized'}), 403

        cursor.execute('UPDATE threads SET title = ?, author = ?, date = ?, description = ? WHERE id = ?',
                       (updated_thread['title'], existing_thread[0], updated_thread['date'], updated_thread['description'], thread_id))

        cursor.execute('DELETE FROM thread_images WHERE threadId = ?', (thread_id,))
        for image_id in updated_thread['imageIds']:
            cursor.execute('INSERT INTO thread_images (threadId, imageId) VALUES (?, ?)', (thread_id, image_id))

        conn.commit()

    return jsonify(updated_thread)

@app.route('/threads/<int:thread_id>', methods=['DELETE'])
def delete_thread(thread_id):
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM threads WHERE id = ?', (thread_id,))
        cursor.execute('DELETE FROM comments WHERE threadId = ?', (thread_id,))
        conn.commit()

    return '', 204
