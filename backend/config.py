import os
from pathlib import Path

# Base directory (still used for uploads folder)
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = BASE_DIR / "uploads"

# PostgreSQL Database Configuration (LOCAL DEFAULTS)
POSTGRES_CONFIG = os.environ.get("DATABASE_URL")

# Allowed file types
ALLOWED_EXTENSIONS = {"pdf"}

# Upload size limit (10MB)
MAX_CONTENT_LENGTH = 10 * 1024 * 1024

# JWT Secret Key
SECRET_KEY = os.environ.get("SECRET_KEY", "supersecretjwtkey")
