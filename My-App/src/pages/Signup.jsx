import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { api } from "../api/api";

// --- Internal Component Definition ---
const InputField = ({ label, type, name, value, onChange, placeholder, className }) => {
  return (
    <div className="input-wrapper">
      <label className="input-label">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
};

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("https://pdfmanager-yt5c.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        // Slight delay to show success state before alert
        setTimeout(() => {
            alert("Signup successful!");
            navigate("/login"); // Redirect to login after success
        }, 500);
      } else {
        alert(data.error || "Signup failed");
      }

    } catch (error) {
      console.error(error);
      alert("Signup failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">

      {/* --- Background Animations --- */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* --- Main Card --- */}
      <div className="glass-card">
        
        {/* Header */}
        <div>
          <h2 className="title">Create Account</h2>
          <p className="subtitle">Join us and start your journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup}>
          
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="custom-input"
          />

          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className="custom-input"
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="custom-input"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="footer">
          Already have an account?
          <button 
            onClick={() => navigate('/login')} 
            className="login-link-btn"
          >
            Log In
          </button>
        </div>

      </div>
    </div>
  );
}