import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "./Main.css";

export default function Main() {
  const navigate = useNavigate();

  // --- State ---
  const [view, setView] = useState("dashboard"); // 'dashboard' | 'upload'
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // --- Auth Check ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("not logged in!!");
      navigate("/login");
    } else {
      if (view === "dashboard") {
        fetchHistory();
      }
    }
  }, [navigate, view]);

  // ========================================================================
  // 1. HISTORY + SEARCH + SORT LOGIC
  // ========================================================================

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/documents/?search=${search}&sort=${sort}`);
      setDocs(res.data);
    } catch (err) {
      console.error("History Fetch Error:", err);

      // fallback example data
      setDocs([
        {
          id: 1,
          filename: "Project_Requirements.pdf",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          filename: "Invoice_#1023.pdf",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const res = await api.get(`/documents/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download error:", err);
      alert("Unauthorized or file not available");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return;

    try {
      await api.delete(`/documents/${id}`);
      setDocs((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete file.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ========================================================================
  // 2. UPLOAD LOGIC
  // ========================================================================

  const handleUpload = async (file) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/documents/upload", formData);

      alert("Upload Successful!");
      setView("dashboard");
      fetchHistory();
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed or unauthorized.");
      setLoading(false);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      handleUpload(file);
    } else {
      alert("Please upload a PDF file.");
    }
  }, []);

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      handleUpload(file);
    }
  };

  return (
    <div className="home-page">
      {/* Background */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand" onClick={() => setView("dashboard")}>
          PDF Manager
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {view === "upload" && (
            <button
              className="btn btn-outline"
              onClick={() => setView("dashboard")}
            >
              History
            </button>
          )}
          <button className="btn btn-outline" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="container">
        {/* ================= VIEW: DASHBOARD ================= */}
        {view === "dashboard" && (
          <>
            <div className="header-row">
              <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>
                Your Uploaded PDFs
              </h2>
              <button
                className="btn btn-primary"
                onClick={() => setView("upload")}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor">
                  <path d="M21 15v4H3v-4" />
                  <path d="M17 8l-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
                Upload PDF
              </button>
            </div>
            <div
              style={{
                marginTop: "20px",
                marginBottom: "10px",
                display: "flex",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Search PDFs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={fetchHistory}
                style={{
                  padding: "10px 15px",
                  width: "260px",
                  borderRadius: "8px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />

              <select
                value={sort}
                // onChange={(e) => {
                //   setSort(e.target.value);
                //   fetchHistory();
                // }}
                style={{
                  padding: "15px",
                  paddingRight: "35px",
                  borderRadius: "8px",
                  background: "#0f172a",
                  color: "white",
                  border: "1px solid #64748b",
                  appearance: "none", 
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  backgroundImage:
                    'url(\'data:image/svg+xml;utf8,<svg fill="white" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>\')',
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="size_desc">Largest First</option>
                <option value="size_asc">Smallest First</option>
              </select>

              <button
                className="btn btn-secondary"
                onClick={fetchHistory}
                style={{ padding: "10px 20px" }}
              >
                Apply
              </button>
            </div>

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#22d3ee",
                }}
              >
                <div
                  className="spinner"
                  style={{
                    margin: "0 auto 10px",
                    width: "30px",
                    height: "30px",
                  }}
                />
                Loading history...
              </div>
            ) : (
              <div className="file-list">
                {docs.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#94a3b8",
                    }}
                  >
                    No PDF files uploaded yet.
                  </div>
                ) : (
                  docs.map((doc) => (
                    <div key={doc.id} className="file-item">
                      <div className="file-info">
                        <span className="file-name">{doc.filename}</span>
                        <span className="file-date">
                          {new Date(doc.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="file-actions">
                        <button
                          className="btn btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(doc.id, doc.filename);
                          }}
                        >
                          Download
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(doc.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* ================= VIEW: UPLOAD ================= */}
        {view === "upload" && (
          <>
            <div className="header-row">
              <button
                className="btn btn-outline"
                onClick={() => setView("dashboard")}
              >
                Back to History
              </button>
            </div>

            <div
              className={`upload-zone ${dragActive ? "active" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {loading ? (
                <div>
                  <div
                    className="spinner"
                    style={{
                      margin: "0 auto 20px",
                      width: "40px",
                      height: "40px",
                    }}
                  />
                  <h3>Uploading...</h3>
                </div>
              ) : (
                <>
                  <h3>Drop PDF File</h3>
                  <p>Drag & drop or upload manually.</p>

                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf"
                    style={{ display: "none" }}
                    onChange={onFileInputChange}
                  />

                  <button
                    className="btn btn-primary"
                    style={{ padding: "14px 32px", fontSize: "1.1rem" }}
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                  >
                    Select PDF
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
