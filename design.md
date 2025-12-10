# PDF Manager — System Design Document

This document provides a detailed overview of the technology stack, architecture, API specifications, data flow, and assumptions for the PDF Manager application.

---

 ## 1. Tech Stack Choices

---

### **Q1. What frontend framework did you use and why?**

**Frontend: React (Vite + React Router)**

**Why React?**
- React is fast, component-based, and ideal for dynamic UI updates such as uploading, listing, and deleting PDFs.
- Vite provides an extremely fast development server and optimized production builds.
- React Router enables clean navigation across login, signup, dashboard, and upload pages.
- Large ecosystem and widely used in industry projects.

---

### **Q2. What backend framework did you use and why?**

**Backend: Flask (Python)**

**Why Flask?**
- Lightweight and easy to structure using modular blueprints.
- Ideal for building REST APIs.
- Simple integration with JWT authentication.
- Strong built-in support for file uploads via `request.files`.
- High developer productivity with minimal boilerplate.

---

### **Q3. What database did you choose and why?**

**Database: PostgreSQL**

**Why PostgreSQL over SQLite or others?**
- PostgreSQL supports concurrency and is production-ready.
- Works seamlessly on Render hosting.
- Offers strong data integrity, indexing, and foreign key support.
- Scales well for multi-user environments, unlike SQLite which is local file–based.

---

### **Q4. If you were to support 1,000 users, what changes would you consider?**

### **Backend Scaling**
- Move from a single Flask instance → Gunicorn with multiple workers.
- Add Redis caching for repeated read operations.

### **Database Scaling**
- Add indexes on:
  - `user_id`
  - `created_at`
  - `filename`
- Use connection pooling (pgbouncer).

### **Storage Scaling**
- Move uploads from local disk → AWS S3 or Google Cloud Storage.

### **Frontend Scaling**
- Implement pagination for document history.
- Debounce search requests to avoid API spam.

---

 ## 2. Architecture Overview
## System Flow Diagram (Simple)

 ``` 
[React Frontend]
|
v
[Flask Backend API] ----> [PostgreSQL]
|
v
[Local File Storage / uploads folder]
 ``` 

---

## Step-by-step Flow



### **Upload Flow**
1. User selects a PDF file in React.
2. React sends it as `FormData` → `/documents/upload`.
3. Flask validates the JWT token.
4. Flask validates file type and size.
5. File is saved to:/uploads/<generated_name>.pdf
6. Metadata is stored in PostgreSQL.
7. API responds with the new document ID.
8. Frontend refreshes the list view.

---

### **Download Flow**
1. User clicks **Download** in React.
2. React sends a `GET /documents/:id` request.
3. Flask validates the JWT token.
4. Flask checks ownership of the file.
5. Flask sends the file using `send_file()`.
6. Browser begins the PDF download.

---

### **Delete Flow**
1. User clicks **Delete**.
2. React sends `DELETE /documents/:id`.
3. Flask validates the JWT token.
4. Flask deletes the file from disk.
5. PostgreSQL entry is removed.
6. Frontend refreshes the document list.

---

## 3. API Specification

Below are all required endpoints with example inputs and outputs.

---

### 1. **POST /documents/upload — Upload PDF**

**Request (multipart/form-data):**




### **High-Level Flow**

- Frontend sends API requests to Flask.
- Flask validates JWT tokens and processes requests.
- PostgreSQL stores all metadata (documents, users).
- Actual PDF files are stored in `/uploads/`.

---
**Request (multipart/form-data):**
```

file: <PDF File>

```

**Headers:**
```

Authorization: Bearer <jwt_token>

````

**Success Response (201):**
```json
{
  "id": 12,
  "filename": "report.pdf",
  "filesize": 248392,
  "created_at": "2025-01-12T10:33:21Z"
}
````

**Description:**
Uploads a PDF, stores it locally, inserts metadata into PostgreSQL.

---

 ### 2. **GET /documents — List All Documents**

**Optional Query Params:**

```
?search=invoice&sort=newest
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
[
  {
    "id": 12,
    "filename": "report.pdf",
    "filesize": 248392,
    "created_at": "2025-01-12T10:33:21Z"
  }
]
```

**Description:**
Returns all PDFs uploaded by the logged-in user, with support for search & sorting.

---

 ### 3. **GET /documents/:id — Download a PDF**

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**
Binary stream (PDF file download)

**Description:**
Downloads a PDF only if it belongs to the requesting user.

---

 ### 4. **DELETE /documents/:id — Delete a PDF**

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "deleted"
}
```

**Description:**
Deletes the file from disk and removes its row from the database.

---

 ## 4. Data Flow Description

---

### **Q5. What happens when a file is uploaded?**

### **Upload Flow (Step-by-step)**

1. User selects or drags a PDF file.
2. Frontend sends a `POST /documents/upload` request with `FormData`.
3. Flask authenticates the user using the JWT token.
4. Flask validates the file (PDF & size limit).
5. File is saved to:

   ```
   /uploads/<generated_name>.pdf
   ```
6. PostgreSQL stores metadata:

   * filename
   * filepath
   * filesize
   * created_at
   * user_id
7. Backend returns metadata.
8. Frontend refreshes the list of documents.

---

### **Download Flow (Step-by-step)**

1. User clicks “Download”.
2. Frontend calls `GET /documents/:id`.
3. Backend validates JWT.
4. Flask verifies that the file belongs to the requesting user.
5. Flask loads the file path and sends file via `send_file()`.
6. Browser receives the PDF and begins downloading it.

---

 ## 5. Assumptions

---

### **File-Related Assumptions**

* Only PDF files are permitted.
* Maximum allowed size: **10MB**.
* Files are stored on local disk under `/uploads/`.

### **Authentication Assumptions**

* JWT tokens expire in **12 hours**.
* Each user can access only documents they uploaded.

### **Database Assumptions**

* Each document references exactly one user via `user_id`.
* No additional metadata (tags, thumbnails, etc.) was needed for this scope.

### **Concurrency Assumptions**

* Flask + Gunicorn is sufficient for assignment-level traffic.
* No extreme load or concurrent upload spikes expected.

### **Search & Sorting**

* Search operates on filenames using `ILIKE`.
* Sorting supports:

  * newest
  * oldest
  * size ascending
  * size descending

---
