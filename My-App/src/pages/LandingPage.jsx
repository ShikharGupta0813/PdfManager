import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* --- Background Animations --- */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* --- Navbar --- */}
      <nav className="navbar">
        <div className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          PDF Manager
        </div>
        <div className="nav-links">
          <button className="btn btn-outline" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="hero">
        <h1>
          The Intelligent Way to <br />
          <span style={{ color: "#22d3ee", background: "none", WebkitTextFillColor: "initial" }}>Manage Documents</span>
        </h1>
        <p>
          Securely upload, organize, and access your PDF documents from anywhere. 
          Experience a lightning-fast workflow designed for modern professionals.
        </p>
        
        <div className="hero-buttons">
          <button className="btn btn-primary btn-large" onClick={() => navigate("/signup")}>
            Get Started Free
          </button>
          <button className="btn btn-outline btn-large" onClick={() => navigate("/login")}>
            Live Demo
          </button>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section className="features">
        
        {/* Feature 1 */}
        <div className="feature-card">
          <div className="icon-box">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <h3>Easy Uploads</h3>
          <p>Drag and drop your files into our secure cloud storage. We handle the processing instantly so you don't have to wait.</p>
        </div>

        {/* Feature 2 */}
        <div className="feature-card">
          <div className="icon-box">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>Secure Storage</h3>
          <p>Your documents are encrypted and protected. We prioritize your privacy and data security above everything else.</p>
        </div>

        {/* Feature 3 */}
        <div className="feature-card">
          <div className="icon-box">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h3>History Tracking</h3>
          <p>Keep track of all your uploads. Access your document history anytime and download files whenever you need them.</p>
        </div>

      </section>

      {/* --- Footer --- */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} PDF Manager System. All rights reserved.</p>
      </footer>

    </div>
  );
}