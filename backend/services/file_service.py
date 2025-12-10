import os
from datetime import datetime
from pathlib import Path
import werkzeug.utils
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file):
    original = werkzeug.utils.secure_filename(file.filename)

    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    unique_name = f"{timestamp}_{original}"

    dest = UPLOAD_FOLDER / unique_name
    file.save(dest)

    return original, dest
