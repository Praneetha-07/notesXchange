import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const s = {
  page: { maxWidth: "400px", margin: "3rem auto", padding: "0 1.25rem" },
  logo: { textAlign: "center", marginBottom: "1.75rem" },
  logoText: { fontSize: "20px", fontWeight: "600", color: "var(--text)" },
  logoDot: {
    display: "inline-block",
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "#1D9E75",
    marginRight: "8px",
    verticalAlign: "middle",
  },
  card: {
    // background: "#fff",
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid #e5e3dc",
    borderRadius: "14px",
    padding: "2rem",
  },
  heading: {
    fontSize: "20px",
    fontWeight: "600",
    // color: "#1a1a18",
    color: "var(--text)",
    marginBottom: "4px",
  },
  sub: { fontSize: "14px", color: "var(--text)", marginBottom: "1.5rem" },
  field: { marginBottom: "14px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    // color: "#6b6960",
    color: "var(--text)",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #e5e3dc",
    borderRadius: "8px",
    fontSize: "14px",
    // color: "#1a1a18",
    // background: "#fafaf8",
    background: "var(--surface)",
    color: "var(--text)",
    outline: "none",
  },
  btn: (loading) => ({
    width: "100%",
    padding: "11px",
    borderRadius: "10px",
    background: loading ? "#9FE1CB" : "#1D9E75",
    color: "#fff",
    border: "none",
    fontSize: "15px",
    fontWeight: "500",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "6px",
  }),
  error: {
    background: "#FAECE7",
    border: "1px solid #F0997B",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#993C1D",
    fontSize: "13px",
    marginBottom: "14px",
  },
  footer: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "13px",
    color: "#a09e97",
  },
  footerLink: { color: "#1D9E75", fontWeight: "500" },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/browse");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={s.page}>
      <div style={s.logo}>
        <span style={s.logoDot} />
        <span style={s.logoText}>NotesXchange</span>
      </div>
      <div style={s.card}>
        <div style={s.heading}>Welcome back</div>
        <div style={s.sub}>Sign in to upload and vote on notes</div>
        {error && <div style={s.error}>{error}</div>}
        <div style={s.field}>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKey}
          />
        </div>
        <div style={s.field}>
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={onKey}
          />
        </div>
        <button
          style={s.btn(loading)}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
      <div style={s.footer}>
        No account?{" "}
        <Link to="/register" style={s.footerLink}>
          Create one
        </Link>
      </div>
    </div>
  );
}
