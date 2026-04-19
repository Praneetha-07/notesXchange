import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BRANCHES = ["CSE", "ECE", "MECH", "CIVIL", "IT", "EEE"];
const SEMESTERS = [
  "Sem 1",
  "Sem 2",
  "Sem 3",
  "Sem 4",
  "Sem 5",
  "Sem 6",
  "Sem 7",
  "Sem 8",
];

const s = {
  page: { maxWidth: "420px", margin: "2.5rem auto", padding: "0 1.25rem" },
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
  select: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #e5e3dc",
    borderRadius: "8px",
    fontSize: "14px",
    color: "var(--text)",
    // color: "#1a1a18",
    // background: "#fafaf8",
    background: "var(--surface)",
    cursor: "pointer",
    outline: "none",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "14px",
  },
  btn: (loading) => ({
    width: "100%",
    padding: "11px",
    borderRadius: "10px",
    background: loading ? "#9FE1CB" : "#1D9E75",
    // color: "#fff",
    color: "var(--text)",
    border: "none",
    fontSize: "15px",
    fontWeight: "500",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "6px",
  }),
  error: {
    // background: "#FAECE7",
    background: "var(--surface)",
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

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "CSE",
    semester: "Sem 1",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.branch,
        form.semester,
      );
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.logo}>
        <span style={s.logoDot} />
        <span style={s.logoText}>NotesXchange</span>
      </div>
      <div style={s.card}>
        <div style={s.heading}>Create account</div>
        <div style={s.sub}>Join the notes community</div>
        {error && <div style={s.error}>{error}</div>}

        <div style={s.field}>
          <label style={s.label}>Full name</label>
          <input
            style={s.input}
            type="text"
            placeholder="Rahul Kumar"
            value={form.name}
            onChange={set("name")}
          />
        </div>
        <div style={s.field}>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            placeholder="you@college.edu"
            value={form.email}
            onChange={set("email")}
          />
        </div>
        <div style={s.row}>
          <div>
            <label style={s.label}>Branch</label>
            <select
              style={s.select}
              value={form.branch}
              onChange={set("branch")}
            >
              {BRANCHES.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={s.label}>Semester</label>
            <select
              style={s.select}
              value={form.semester}
              onChange={set("semester")}
            >
              {SEMESTERS.map((sem) => (
                <option key={sem}>{sem}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={s.field}>
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={set("password")}
          />
        </div>

        <button
          style={s.btn(loading)}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </div>
      <div style={s.footer}>
        Already have an account?{" "}
        <Link to="/login" style={s.footerLink}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
