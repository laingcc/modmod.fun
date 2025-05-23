import sqlite3
from __main__ import app
from flask import request, jsonify
from configs import server_configs

# Helper to get DB connection
def get_db():
    return sqlite3.connect(server_configs['db_path'])

@app.route('/tags', methods=['GET'])
def get_tags():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, name FROM tags')
        tags = cursor.fetchall()
        tag_data = []
        for tag_id, name in tags:
            cursor.execute('SELECT threadId FROM thread_tags WHERE tagId = ?', (tag_id,))
            thread_ids = [row[0] for row in cursor.fetchall()]
            tag_data.append({'id': tag_id, 'name': name, 'threadIds': thread_ids})
    return jsonify(tag_data)

@app.route('/tags/<int:tag_id>', methods=['GET'])
def get_tag(tag_id):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, name FROM tags WHERE id = ?', (tag_id,))
        tag = cursor.fetchone()
        if not tag:
            return jsonify({'error': 'Tag not found'}), 404
        cursor.execute('SELECT threadId FROM thread_tags WHERE tagId = ?', (tag_id,))
        thread_ids = [row[0] for row in cursor.fetchall()]
    return jsonify({'id': tag[0], 'name': tag[1], 'threadIds': thread_ids})

@app.route('/tags', methods=['POST'])
def create_tag():
    new_tag = request.get_json()
    name = new_tag.get('name')
    thread_ids = new_tag.get('threadIds', [])
    if not name or not thread_ids:
        return jsonify({'error': 'name and threadIds are required'}), 400

    with get_db() as conn:
        cursor = conn.cursor()
        # Check if tag already exists
        cursor.execute('SELECT id FROM tags WHERE name = ?', (name,))
        tag_row = cursor.fetchone()
        if tag_row:
            tag_id = tag_row[0]
        else:
            cursor.execute('INSERT INTO tags (name) VALUES (?)', (name,))
            tag_id = cursor.lastrowid

        # Insert into thread_tags
        for thread_id in thread_ids:
            cursor.execute('SELECT 1 FROM thread_tags WHERE tagId = ? AND threadId = ?', (tag_id, thread_id))
            if not cursor.fetchone():
                cursor.execute('INSERT INTO thread_tags (tagId, threadId) VALUES (?, ?)', (tag_id, thread_id))
        conn.commit()
    return jsonify({'id': tag_id, 'name': name, 'threadIds': thread_ids}), 201

@app.route('/tags/<int:tag_id>', methods=['DELETE'])
def delete_tag(tag_id):
    with get_db() as conn:
        cursor = conn.cursor()
        # Remove all thread associations
        cursor.execute('DELETE FROM thread_tags WHERE tagId = ?', (tag_id,))
        # Remove the tag itself
        cursor.execute('DELETE FROM tags WHERE id = ?', (tag_id,))
        conn.commit()
    return '', 204

@app.route('/threads/<int:thread_id>/tags', methods=['GET'])
def get_thread_tags(thread_id):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT tags.id, tags.name
            FROM tags
            JOIN thread_tags ON tags.id = thread_tags.tagId
            WHERE thread_tags.threadId = ?
        ''', (thread_id,))
        tags = cursor.fetchall()
    return jsonify([{'id': t[0], 'name': t[1]} for t in tags])

@app.route('/threads/<int:thread_id>/tags', methods=['POST'])
def add_tag_to_thread(thread_id):
    tag_data = request.get_json()
    tag_name = tag_data.get('name')
    if not tag_name:
        return jsonify({'error': 'name is required'}), 400

    with get_db() as conn:
        cursor = conn.cursor()
        # Check if tag exists
        cursor.execute('SELECT id FROM tags WHERE name = ?', (tag_name,))
        tag_row = cursor.fetchone()
        if tag_row:
            tag_id = tag_row[0]
        else:
            cursor.execute('INSERT INTO tags (name) VALUES (?)', (tag_name,))
            tag_id = cursor.lastrowid

        # Add association if not exists
        cursor.execute('SELECT 1 FROM thread_tags WHERE tagId = ? AND threadId = ?', (tag_id, thread_id))
        if not cursor.fetchone():
            cursor.execute('INSERT INTO thread_tags (tagId, threadId) VALUES (?, ?)', (tag_id, thread_id))
        conn.commit()
    return jsonify({'id': tag_id, 'name': tag_name}), 201

@app.route('/threads/<int:thread_id>/tags/<int:tag_id>', methods=['DELETE'])
def remove_tag_from_thread(thread_id, tag_id):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM thread_tags WHERE tagId = ? AND threadId = ?', (tag_id, thread_id))
        conn.commit()
    return '', 204
