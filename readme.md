# 📄 PDF Manager — Full Stack Application

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Flask](https://img.shields.io/badge/Backend-Flask-000000)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)

A robust full-stack web application designed to securely manage PDF documents. Users can upload, view, search, sort, and download files within a protected environment.

## 🔗 Live Demo & Links
- **🚀 Live Demo:** [https://pdf-manager-live-demo.com](https://pdf-manager-live-demo.com)
- **📂 GitHub Repository:** [https://github.com/your-username/pdf-manager](https://github.com/your-username/pdf-manager)

---

### 🚀 Project Overview

I have built a **full-stack PDF Management System** that allows authenticated users to securely upload, view, search, sort, download, and delete their PDF files through a clean and responsive user interface.

The application features **secure user authentication implemented using JWT**, ensuring that each user can only access their own documents. Once logged in, a user is presented with a **personalized dashboard** where they can view all the PDFs they have uploaded. Unauthorized access to other users’ files is strictly prevented through **server-side ownership checks**.

To enhance usability, the system includes powerful file management features such as:

* **🔍 Search:** Filter documents quickly by PDF name.
* **🔃 Sorting Options:**
    * Newest first
    * Oldest first
    * Largest file
    * Smallest file

These controls help users manage large document libraries easily and efficiently.

### **Frontend (React + Vite)**
- 🔐 **Secure Login & Signup:** JWT-based authentication.
- 📤 **Drag & Drop Upload:** Easy interface for adding new PDFs.
- 🔍 **Search & Filter:** Real-time filtering by filename.
- 🔃 **Sorting:** Sort by date (Newest/Oldest) and size.
- 📱 **Responsive UI:** Clean interface built for usability.

### **Backend (Flask)**
- 🛡️ **JWT Authentication:** Stateless security for API routes.
- 📂 **Secure File Handling:** Validates file types and stores securely.
- 🗄️ **PostgreSQL Integration:** Robust data storage for user and file metadata.
- 🔒 **Data Isolation:** Users can only access their own data.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Axios, React Router, Tailwind CSS (optional) |
| **Backend** | Python, Flask, Flask-CORS, SQLAlchemy |
| **Database** | PostgreSQL |
| **Auth** | JWT (JSON Web Tokens), Bcrypt |

---

## ⚙️ Installation & Local Setup

Follow these steps to run the application locally.

### **1. Clone the Repository**
```bash
git clone [https://github.com/your-username/PdfManager.git](https://github.com/your-username/PdfManager.git)
cd PdfManager
````

### **2. Backend Setup (Flask)**

Navigate to the backend directory and set up the environment.

```bash
cd backend
# Create virtual environment (Optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Configure Environment Variables:**
Create a `.env` file in the `backend/` folder:

```env
SECRET_KEY=your_super_secret_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/pdf_db
UPLOAD_FOLDER=uploads
```

**Run the Server:**

```bash
# Initialize database tables (first time only)
python create_tables.py

# Start the server
python app.py
```

*The Backend will run on: `http://localhost:5000`*

### **3. Frontend Setup (React)**

Open a new terminal and navigate to the frontend directory.

```bash
cd My-App
# Install dependencies
npm install

# Start the development server
npm run dev
```

*The Frontend will run on: `http://localhost:5173`*

-----

## 📡 API Reference

All document endpoints require a valid JWT Token in the header:  
`Authorization: Bearer <your_token>`

### 1️⃣ Authentication

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT |

**Example (Login):**

```bash
curl -X POST http://localhost:5000/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"test@mail.com","password":"123456"}'
```

### 2️⃣ Document Management

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/documents/upload` | Upload a PDF file |
| `GET` | `/documents` | List all PDFs (supports `?search=` & `?sort=`) |
| `GET` | `/documents/:id` | Download a specific PDF |
| `DELETE` | `/documents/:id` | Delete a specific PDF |

**Example (Upload PDF):**

```bash
curl -X POST http://localhost:5000/documents/upload \
-H "Authorization: Bearer <token>" \
-F "file=@/path/to/document.pdf"
```

-----

## 📦 Project Structure

```plaintext
/backend
 ├── app.py                # Entry point
 ├── config.py             # App configuration
 ├── models.py             # Database Models
 ├── routes/               # API Endpoints
 ├── services/             # Business Logic
 ├── uploads/              # Local file storage
 └── requirements.txt      # Python dependencies

/My-App (Frontend)
 ├── src/
 │   ├── api/              # Axios instances
 │   ├── components/       # Reusable UI components
 │   ├── pages/            # Login, Dashboard, etc.
 │   └── App.jsx           # Main component
 ├── package.json          # Node dependencies
 └── vite.config.js        # Vite config
```

-----

## 🛡️ Security Measures

  * **Password Hashing:** Passwords are hashed using `bcrypt` before storage.
  * **Token Expiry:** JWT tokens have a set expiration time to prevent misuse.
  * **File Validation:** Strict checking ensures only PDF files are uploaded.

## 📌 Future Enhancements

  * [ ] Integration with AWS S3 for cloud storage.
  * [ ] PDF Thumbnail generation.
  * [ ] Shareable links for public access.

-----

## 🤝 Contributing

Contributions are welcome\! Please fork the repository and create a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

-----

**Created by Shikhar Gupta**
