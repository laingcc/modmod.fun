import os
import sqlite3
import uuid
from flask import request, jsonify, send_from_directory
from __main__ import app
from PIL import Image, ImageOps  # Add this import for image processing

from configs import server_configs
from server_utils.server_utils import get_tripcode

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

THUMBNAIL_FOLDER = 'thumbnails'
os.makedirs(THUMBNAIL_FOLDER, exist_ok=True)

@app.route('/images', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file or threadId provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = f"{uuid.uuid4().hex}_{file.filename}"
    img = Image.open(file.read())
    img = ImageOps.exif_transpose(img)  # Handle EXIF orientation
    # Remove EXIF data by creating a new Image object and save as webp
    img_no_exif = Image.new(img.mode, img.size)
    img_no_exif.putdata(list(img.getdata()))
    img_no_exif.save(os.path.join(UPLOAD_FOLDER, filename), "webp", quality=90)


    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO images (filename) VALUES (?)', (filename,))
        conn.commit()

    return jsonify({'filename': filename}), 201

@app.route('/images/<filename>', methods=['GET'])
def get_image(filename):
    full_res = request.args.get('full_res', 'false').lower() == 'true'

    if full_res:
        return send_from_directory(UPLOAD_FOLDER, filename)

    # Generate and serve a thumbnail
    thumbnail_path = os.path.join(THUMBNAIL_FOLDER, filename)
    original_path = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(thumbnail_path):
        try:
            with Image.open(original_path) as img:
                thumbnail_size = (250,150)
                background = Image.new('RGB', thumbnail_size, (0,0,0))
                img.thumbnail(thumbnail_size, Image.LANCZOS)

                offset = ((thumbnail_size[0] - img.width) // 2, (thumbnail_size[1] - img.height) // 2)
                background.paste(img, offset)
                background.save(thumbnail_path, "webp", quality=90)
        except Exception as e:
            return jsonify({'error': f'Failed to generate thumbnail: {str(e)}'}), 500

    return send_from_directory(THUMBNAIL_FOLDER, filename)

@app.route('/images/batch', methods=['POST'])
def upload_images_batch():
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    files = request.files.getlist('files')
    if not files:
        return jsonify({'error': 'No selected files'}), 400

    uploaded_files = []
    with sqlite3.connect(server_configs['db_path']) as conn:
        cursor = conn.cursor()
        for file in files:
            if file.filename == '':
                continue

            filename = f"{uuid.uuid4().hex}_{file.filename}"
            img = Image.open(file.stream)
            img = ImageOps.exif_transpose(img)  # Handle EXIF orientation
            # Remove EXIF data by creating a new Image object and save as webp
            img_no_exif = Image.new(img.mode, img.size)
            img_no_exif.putdata(list(img.getdata()))
            img_no_exif.save(os.path.join(UPLOAD_FOLDER, filename), "webp", quality=90)
            cursor.execute('INSERT INTO images (filename) VALUES (?)', (filename,))
            uploaded_files.append({'filename': filename})

        conn.commit()

    return jsonify(uploaded_files), 201

