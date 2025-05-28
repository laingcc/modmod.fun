import sqlite3
from __main__ import app

from flask import request, jsonify

from configs import server_configs
from server_utils.server_utils import get_tripcode

from __main__ import limiter

@app.route('/users', methods=['POST'])
@limiter.limit(server_configs['rate_limit'])
def create_user():
    new_user = request.get_json()
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (tripcode, email, friendlyname) VALUES (?, ?, ?)',
                       (get_tripcode(new_user['tripcode'], server_configs['salt']), new_user['email'], new_user['friendlyname']))
        conn.commit()

    return jsonify(new_user), 201

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    updated_user = request.get_json()
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT tripcode FROM users WHERE id = ?', (user_id,))
        existing_user = cursor.fetchone()

        if existing_user is None or get_tripcode(updated_user['tripcode'], server_configs['salt']) != existing_user[0]:
            return jsonify({'error': 'Unauthorized'}), 403

        cursor.execute('UPDATE users SET email = ?, friendlyname = ? WHERE id = ?',
                       (updated_user['email'], updated_user['friendlyname'], user_id))
        conn.commit()

    return jsonify(updated_user)

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
        conn.commit()

    return '', 204

@app.route('/users/<string:tripcode>', methods=['GET'])
def get_user(tripcode):
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE tripcode = ?', tripcode)
        user = cursor.fetchone()

    if user:
        return jsonify({
            'id': user[0],
            'tripcode': user[1],
            'email': user[2],
            'friendlyname': user[3]
        })
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/users', methods=['GET'])
def get_users():
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users')
        users = cursor.fetchall()

    return jsonify([{
        'id': u[0],
        'tripcode': u[1],
        'email': u[2],
        'friendlyname': u[3]
    } for u in users])
