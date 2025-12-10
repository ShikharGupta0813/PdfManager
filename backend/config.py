import os
from pathlib import Path

# Base directory (still used for uploads folder)
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = BASE_DIR / "uploads"

# PostgreSQL Database Configuration (LOCAL DEFAULTS)
POSTGRES_CONFIG = {
    "dbname": os.environ.get("PG_NAME", "postgres"),      # your local database name
    "user": os.environ.get("PG_USER", "postgres"),        # default PostgreSQL user
    "password": os.environ.get("PG_PASSWORD", "2004"),# default password (change if needed)
    "host": os.environ.get("PG_HOST", "localhost"),       # localhost for local DB
    "port": os.environ.get("PG_PORT", "5432")             # default PostgreSQL port
}

# Allowed file types
ALLOWED_EXTENSIONS = {"pdf"}

# Upload size limit (10MB)
MAX_CONTENT_LENGTH = 10 * 1024 * 1024

# JWT Secret Key
SECRET_KEY = os.environ.get("SECRET_KEY", "supersecretjwtkey")
