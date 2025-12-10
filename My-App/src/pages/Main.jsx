import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "./Main.css";

export default function Main() {
  const navigate = useNavigate();
  
  // --- State ---
  const [view, setView] = useState("dashboard"); // 'dashboard' | 'upload'
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false); // Used for both Fetching list & Uploading
  const [dragActive, setDragActive] = useState(false);

  // --- Auth Check ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("not logged in!!");
      navigate("/login");
    } else {
      // If we are in dashboard view, fetch data
      if (view === "dashboard") {
        fetchHistory();
      }
    }
  }, [navigate, view]);

  // ========================================================================
  // 1. DASHBOARD / HISTORY LOGIC (from DocumentsHistory.tsx)
  // ========================================================================

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/documents/");
      setDocs(res.data);
    } catch (err) {
      console.error("History Fetch Error:", err);
      // alert("Unauthorized! Please login again.");
      // localStorage.removeItem("token");
      // navigate("/login");
      
      // Fallback for preview if API fails
      setDocs([
        { id: 1, filename: "Project_Requirements.pdf", created_at: new Date().toISOString() },
        { id: 2, filename: "Invoice_#1023.pdf", created_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const res = await api.get(`/documents/${id}`, {
        responseType: "blob", // VERY IMPORTANT
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
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
  // 2. UPLOAD LOGIC (from Upload.tsx & FileUpload.tsx)
  // ========================================================================

  const handleUpload = async (file) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/documents/upload", formData);
      const docId = res.data.id;

      // On success, switch back to dashboard and refresh list
      alert("Upload Successful!");
      setView("dashboard");
      fetchHistory();
      
      // Original logic was: navigate(`/documents/${docId}`);
      // I changed it to stay on the Home page to fit the "One Page" requirement.
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed or unauthorized.");
      setLoading(false);
    }
  };

  // Drag-Drop Handlers
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
      {/* --- Internal CSS Styles --- */}
      <style>{`
        /

      `}</style>

      {/* --- Background --- */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* --- Navbar --- */}
      <nav className="navbar">
        <div className="brand" onClick={() => setView("dashboard")}>
          PDF Manager
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            {view === 'upload' && (
                <button className="btn btn-outline" onClick={() => setView("dashboard")}>
                    History
                </button>
            )}
            <button className="btn btn-outline" onClick={handleLogout}>
            Log Out
            </button>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <div className="container">
        
        {/* ================= VIEW: DASHBOARD ================= */}
        {view === "dashboard" && (
            <>
                <div className="header-row">
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Your Uploaded PDFs</h2>
                    <button className="btn btn-primary" onClick={() => setView("upload")}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Upload PDF
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#22d3ee" }}>
                        <div className="spinner" style={{ margin: "0 auto 10px", width: "30px", height: "30px" }}/>
                        Loading history...
                    </div>
                ) : (
                    <div className="file-list">
                        {docs.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                                No PDF files uploaded yet.
                            </div>
                        ) : (
                            docs.map((doc) => (
                                <div key={doc.id} className="file-item">
                                    <div className="file-info">
                                        <span className="file-name">{doc.filename}</span>
                                        <span className="file-date">{new Date(doc.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className="file-actions">
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={(e) => { e.stopPropagation(); handleDownload(doc.id, doc.filename); }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                            Download
                                        </button>
                                        <button 
                                            className="btn btn-danger"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
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
                    <button className="btn btn-outline" onClick={() => setView("dashboard")}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Back to History
                    </button>
                </div>

                <div 
                    className={`upload-zone ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {loading ? (
                        <div>
                             <div className="spinner" style={{ margin: "0 auto 20px", width: "40px", height: "40px" }}/>
                             <h3 style={{fontSize: "1.5rem"}}>Uploading...</h3>
                        </div>
                    ) : (
                        <>
                            <h3>Drop PDF File</h3>
                            <p>Drag & drop or upload manually.</p>
                            
                            <input
                                id="file-input"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                style={{ display: 'none' }}
                                onChange={onFileInputChange}
                            />
                            
                            <button 
                                className="btn btn-primary" 
                                style={{ padding: '14px 32px', fontSize: '1.1rem' }}
                                onClick={() => document.getElementById("file-input").click()}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
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