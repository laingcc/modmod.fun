import sqlite3
import logging

from flask import request, jsonify, Blueprint

from configs import server_configs
from server_utils.server_utils import get_tripcode

app = Blueprint('comments', __name__)
app_limited = Blueprint('comments_limited', __name__)

logger = logging.getLogger(__name__)

@app_limited.route('/threads/<int:thread_id>/comments', methods=['POST'])
def create_comment(thread_id):
    logger.info(f"Creating a comment for thread ID {thread_id}...")
    new_comment = request.get_json()
    print(new_comment)
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

        # Get the generated comment_id
        comment_id = cursor.lastrowid

        # Insert images into comment_images table
        for image in new_comment.get('images', []):
            cursor.execute('''
                INSERT INTO comment_images (commentId, imageId)
                VALUES (?, ?)
            ''', (comment_id, image))
        conn.commit()

    logger.info(f"Comment created for thread ID {thread_id}.")
    return jsonify(new_comment), 201

@app.route('/threads/<int:thread_id>/comments/<int:comment_id>', methods=['PUT'])
def update_comment(thread_id, comment_id):
    logger.info(f"Updating comment ID {comment_id} for thread ID {thread_id}...")
    updated_comment = request.get_json()
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT author FROM comments WHERE id = ? AND threadId = ?', (comment_id, thread_id))
        existing_comment = cursor.fetchone()

        if not existing_comment:
            logger.error(f"Comment ID {comment_id} for thread ID {thread_id} not found.")
            return jsonify({'error': 'Comment not found'}), 404

        if get_tripcode(updated_comment['author'], server_configs['salt']) != existing_comment[0]:
            logger.error(f"Unauthorized update attempt for comment ID {comment_id}.")
            return jsonify({'error': 'Unauthorized'}), 403

        cursor.execute('UPDATE comments SET author = ?, content = ?, date = ?, feverCount = ? WHERE id = ? AND threadId = ?',
                       (updated_comment['author'], updated_comment['content'], updated_comment['date'], updated_comment['feverCount'], comment_id, thread_id))
        conn.commit()

    logger.info(f"Comment ID {comment_id} for thread ID {thread_id} updated.")
    return jsonify(updated_comment)

@app.route('/threads/<int:thread_id>/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(thread_id, comment_id):
    logger.info(f"Deleting comment ID {comment_id} for thread ID {thread_id}...")
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM comments WHERE id = ? AND threadId = ?', (comment_id, thread_id))
        if not cursor.fetchone():
            logger.error(f"Comment ID {comment_id} for thread ID {thread_id} not found.")
            return jsonify({'error': 'Comment not found'}), 404

        cursor.execute('DELETE FROM comments WHERE id = ? AND threadId = ?', (comment_id, thread_id))
        conn.commit()

    logger.info(f"Comment ID {comment_id} for thread ID {thread_id} deleted.")
    return '', 204
