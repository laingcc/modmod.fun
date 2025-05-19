import os
import sqlite3
import uuid
from flask import request, jsonify, send_from_directory
from __main__ import app

from configs import server_configs
from server_utils.server_utils import get_tripcode

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/images', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file or threadId provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file.save(os.path.join(UPLOAD_FOLDER, filename))

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO images (filename) VALUES (?)', (filename,))
    conn.commit()
    conn.close()

    return jsonify({'filename': filename}), 201

@app.route('/images/<filename>', methods=['GET'])
def get_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/images/batch', methods=['POST'])
def upload_images_batch():
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    files = request.files.getlist('files')
    if not files:
        return jsonify({'error': 'No selected files'}), 400

    uploaded_files = []
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    for file in files:
        if file.filename == '':
            continue

        filename = f"{uuid.uuid4().hex}_{file.filename}"
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        cursor.execute('INSERT INTO images (filename) VALUES (?)', (filename,))
        uploaded_files.append({'filename': filename})

    conn.commit()
    conn.close()

    return jsonify(uploaded_files), 201
