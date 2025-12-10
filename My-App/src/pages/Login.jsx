import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

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

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("https://pdfmanager-yt5c.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        // Using a gentle timeout to let the user see the success state
        setTimeout(() => {
            alert("Login Successful!");
            navigate("/main");
        }, 500);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* --- Background Animations --- */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* --- Main Card --- */}
      <div className="glass-card">
        
        {/* Header */}
        <div>
          <h2 className="title">Welcome Back</h2>
          <p className="subtitle">Please enter your details to sign in</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          
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
          
          {/* <div className="forgot-link">
            <button type="button" className="forgot-btn">
              Forgot Password?
            </button>
          </div> */}

          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="footer">
          Don’t have an account?
          <button 
            onClick={() => navigate('/signup')} 
            className="signup-btn"
          >
            Sign Up
          </button>
        </div>

      </div>
    </div>
  );
}