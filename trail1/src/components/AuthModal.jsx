import React, { useEffect, useState } from "react";
import "./AuthModal.css";

const AuthModal = ({ open, onClose, onSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);

  // ✅ FORM STATE
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔒 Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;

  // =====================
  // AUTH HANDLER
  // =====================
  const handleAuth = async (e) => {
    e.preventDefault();

    const endpoint = isSignup ? "/signup" : "/login";

    const payload = isSignup
      ? { full_name: fullName, email, password }
      : { email, password };

    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Authentication failed");
      }

      const data = await res.json();

      // ✅ SAVE TOKEN
      localStorage.setItem("token", data.access_token);

      onSuccess();
    } catch (error) {
      alert("Invalid credentials or server error");
    }
  };

  return (
    <div
      className="auth-overlay"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="auth-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="auth-title">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <form className="auth-form" onSubmit={handleAuth}>
          {/* ✅ FULL NAME FIXED */}
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? "Already have an account?" : "New user?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Login" : " Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
