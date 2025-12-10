from flask import Blueprint, request, jsonify, send_file
from datetime import datetime
import os
import jwt
import psycopg2
from flask_bcrypt import Bcrypt

from config import SECRET_KEY, POSTGRES_CONFIG
from database.db import get_db_conn
from services.file_service import allowed_file, save_uploaded_file

bcrypt = Bcrypt()

documents_bp = Blueprint("documents", __name__)
auth_bp = Blueprint("auth", __name__)


# ---------------- AUTH HELPER ----------------
def require_auth(request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.split(" ")[1]

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded
    except Exception as e:
        print("JWT error:", e)
        return None


# ---------------- UPLOAD ----------------
@documents_bp.route("/upload", methods=["POST"])
def upload_document():
    user = require_auth(request)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = user["user_id"]

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "only PDF allowed"}), 400

    original, saved_path = save_uploaded_file(file)
    filesize = saved_path.stat().st_size
    created_at = datetime.utcnow()

    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO documents (filename, filepath, filesize, created_at, user_id)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
    """, (original, str(saved_path), filesize, created_at, user_id))

    doc_id = cur.fetchone()["id"]

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "id": doc_id,
        "filename": original,
        "filesize": filesize,
        "created_at": created_at.isoformat()
    }), 201


# ---------------- LIST DOCUMENTS (User Specific) ----------------
@documents_bp.route("/", methods=["GET"])
def list_documents():
    user = require_auth(request)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = user["user_id"]

    search = request.args.get("search", "").strip()        # e.g. ?search=report
    sort = request.args.get("sort", "newest").strip()      # e.g. ?sort=oldest

    # Build base query
    query = """
        SELECT id, filename, filesize, created_at
        FROM documents
        WHERE user_id = %s
    """
    params = [user_id]

    # Apply search filter
    if search:
        query += " AND LOWER(filename) LIKE LOWER(%s)"
        params.append(f"%{search}%")

    # Apply sorting
    if sort == "oldest":
        query += " ORDER BY created_at ASC"
    elif sort == "size_asc":
        query += " ORDER BY filesize ASC"
    elif sort == "size_desc":
        query += " ORDER BY filesize DESC"
    else:  # default newest
        query += " ORDER BY created_at DESC"

    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute(query, tuple(params))
    docs = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(docs)



# ---------------- DOWNLOAD ----------------
@documents_bp.route("/<int:doc_id>", methods=["GET"])
def download_document(doc_id):
    user = require_auth(request)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = user["user_id"]

    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT * FROM documents
        WHERE id = %s AND user_id = %s
    """, (doc_id, user_id))

    doc = cur.fetchone()

    cur.close()
    conn.close()

    if not doc:
        return jsonify({"error": "Not authorized"}), 403

    filepath = doc["filepath"]

    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    return send_file(filepath, as_attachment=True, download_name=doc["filename"])


# ---------------- DELETE ----------------
@documents_bp.route("/<int:doc_id>", methods=["DELETE"])
def delete_document(doc_id):
    user = require_auth(request)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = user["user_id"]

    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT filepath FROM documents
        WHERE id = %s AND user_id = %s
    """, (doc_id, user_id))

    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return jsonify({"error": "Not authorized"}), 403

    filepath = row["filepath"]

    # Delete file
    if os.path.exists(filepath):
        os.remove(filepath)

    # Delete from DB
    cur.execute("DELETE FROM documents WHERE id = %s AND user_id = %s", (doc_id, user_id))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"message": "File deleted"}), 200


# ---------------- LOGIN ----------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "email and password required"}), 400

    email = data["email"]
    password = data["password"]

    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute("SELECT id, name, email, password FROM users WHERE email = %s", (email,))
    user = cur.fetchone()

    cur.close()
    conn.close()

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Correct unpack
    user_id = user["id"]
    name = user["name"]
    email_db = user["email"]
    hashed_password = user["password"]

    # FIX invalid salt here
    if not bcrypt.check_password_hash(hashed_password.encode("utf-8"), password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode({
        "user_id": user_id,
        "name": name,
        "email": email_db,
        "exp": datetime.utcnow().timestamp() + (60 * 60 * 12)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email_db
        }
    }), 200



# ---------------- SIGNUP ----------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    if not data or "name" not in data or "email" not in data or "password" not in data:
        return jsonify({"error": "name, email and password are required"}), 400

    name = data["name"]
    email = data["email"]
    password = data["password"]

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing = cur.fetchone()

    if existing:
        cur.close()
        conn.close()
        return jsonify({"error": "Email already registered"}), 409

    cur.execute("""
        INSERT INTO users (name, email, password)
        VALUES (%s, %s, %s)
        RETURNING id;
    """, (name, email, hashed_pw))

    user_id = cur.fetchone()["id"]

    conn.commit()
    cur.close()
    conn.close()

    token = jwt.encode({
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow().timestamp() + 60 * 60 * 12 
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "message": "Signup successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    }), 201
