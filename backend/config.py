import os
from dotenv import load_dotenv
load_dotenv()
from pathlib import Path

# Base directory (still used for uploads folder)
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = BASE_DIR / "uploads"

# PostgreSQL Database Configuration (LOCAL DEFAULTS)
POSTGRES_CONFIG = os.environ["DATABASE_URL"]

# Allowed file types
ALLOWED_EXTENSIONS = {"pdf"}

# Upload size limit (10MB)
MAX_CONTENT_LENGTH = 10 * 1024 * 1024

# JWT Secret Key
SECRET_KEY = os.environ["SECRET_KEY"]

