import sqlite3
from __main__ import app

from flask import request, jsonify

from configs import server_configs
from server_utils.server_utils import get_tripcode

from __main__ import limiter

@app.route('/threads/<int:thread_id>/comments', methods=['POST'])
@limiter.limit(server_configs['rate_limit'])
def create_comment(thread_id):
    new_comment = request.get_json()
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO comments (author, content, date, feverCount, threadId, parentId)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            get_tripcode(new_comment['author'], server_configs['salt']),
            new_comment['content'],
            new_comment['date'],
            0,
            thread_id,
            new_comment.get('parentId')
        ))
        conn.commit()

    return jsonify(new_comment), 201

@app.route('/threads/<int:thread_id>/comments/<int:comment_id>', methods=['PUT'])
def update_comment(thread_id, comment_id):
    updated_comment = request.get_json()
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT author FROM comments WHERE id = ? AND threadId = ?', (comment_id, thread_id))
        existing_comment = cursor.fetchone()

        if existing_comment is None or get_tripcode(updated_comment['author'], server_configs['salt']) != existing_comment[0]:
            return jsonify({'error': 'Unauthorized'}), 403

        cursor.execute('UPDATE comments SET author = ?, content = ?, date = ?, feverCount = ? WHERE id = ? AND threadId = ?',
                       (updated_comment['author'], updated_comment['content'], updated_comment['date'], updated_comment['feverCount'], comment_id, thread_id))
        conn.commit()

    return jsonify(updated_comment)

@app.route('/threads/<int:thread_id>/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(thread_id, comment_id):
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM comments WHERE id = ? AND threadId = ?', (comment_id, thread_id))
        conn.commit()

    return '', 204
