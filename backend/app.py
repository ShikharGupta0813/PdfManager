from flask import Flask
from flask_cors import CORS
from routes.documents_route import documents_bp
from config import UPLOAD_FOLDER, MAX_CONTENT_LENGTH
from pathlib import Path
from create_db import create_tables
from routes.documents_route import auth_bp


app = Flask(__name__)

# Ensure uploads folder exists
UPLOAD_FOLDER.mkdir(exist_ok=True)

# Apply CORS first
CORS(app,
     resources={r"/*": {"origins": "https://frontendpdfmanager.onrender.com"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type", "Authorization"]
)

# Config
app.config["UPLOAD_FOLDER"] = str(UPLOAD_FOLDER)
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

# Register routes
app.register_blueprint(documents_bp, url_prefix="/documents")
app.register_blueprint(auth_bp, url_prefix="/auth")


@app.route("/")
def home():
    return "Backend Running"

if __name__ == "__main__":
    create_tables()
    app.run(port=5000, debug=True)
