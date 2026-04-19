import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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
const BRANCHES = ["CSE", "ECE", "MECH", "CIVIL", "IT", "EEE"];

const s = {
  page: { maxWidth: "600px", margin: "0 auto", padding: "2rem 1.25rem" },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    // color: "#1a1a18",
    color: "var(--text)",
    marginBottom: "4px",
  },
  subtitle: { fontSize: "14px", color: "var(--text)", marginBottom: "1.75rem" },
  card: {
    background: "var(--surface)",
    border: "1px solid #e5e3dc",
    borderRadius: "14px",
    padding: "1.75rem",
  },
  field: { marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "var(--text)",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #e5e3dc",
    borderRadius: "8px",
    fontSize: "14px",
    color: "var(--text)",
    background: "var(--surface)",
    outline: "none",
    transition: "border-color 0.15s",
  },
  select: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #e5e3dc",
    borderRadius: "8px",
    fontSize: "14px",
    color: "var(--text)",
    background: "var(--surface)",
    cursor: "pointer",
    outline: "none",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  dropzone: (drag) => ({
    border: `2px dashed ${drag ? "#1D9E75" : "#e5e3dc"}`,
    borderRadius: "10px",
    padding: "2.5rem 1rem",
    textAlign: "center",
    cursor: "pointer",
    background: drag ? "#E1F5EE" : "var(--surface)",
    transition: "all 0.15s",
  }),
  dropText: { fontSize: "14px", color: "var(--text)", marginBottom: "4px" },
  dropHint: { fontSize: "12px", color: "var(--text)" },
  fileChosen: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    // background: "#E1F5EE",
    background: "var(--surface)",
    borderRadius: "8px",
    border: "1px solid #5DCAA5",
    marginTop: "8px",
  },
  fileName: {
    fontSize: "13px",
    color: "var(--text)",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  removeBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text)",
    cursor: "pointer",
    fontSize: "16px",
    padding: "0 4px",
  },
  submitBtn: (loading) => ({
    width: "100%",
    padding: "11px",
    borderRadius: "10px",
    background: loading ? "#9FE1CB" : "#1D9E75",
    color: "var(--text)",
    border: "none",
    fontSize: "15px",
    fontWeight: "500",
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "8px",
    transition: "opacity 0.15s",
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
  success: {
    background: "#E1F5EE",
    border: "1px solid #5DCAA5",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#0F6E56",
    fontSize: "13px",
    marginBottom: "14px",
  },
};

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    subjectCode: "",
    semester: "Sem 1",
    branch: "CSE",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFile = (f) => {
    if (!f) return;
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowed.includes(f.type)) {
      setError("Only PDF, JPG, PNG, or WEBP files are allowed.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      return;
    }
    setFile(f);
    setError("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.subject ||
      !form.subjectCode ||
      !form.semester ||
      !form.branch
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("file", file);
      await api.post("/notes", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Note uploaded successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.title}>Upload notes</div>
      <div style={s.subtitle}>
        Share your study materials with fellow students
      </div>

      <div style={s.card}>
        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}

        <div style={s.field}>
          <label style={s.label}>Title</label>
          <input
            style={s.input}
            type="text"
            placeholder="e.g. Unit 3 – Data Structures"
            value={form.title}
            onChange={set("title")}
          />
        </div>

        <div style={{ ...s.field, ...s.row }}>
          <div>
            <label style={s.label}>Subject code</label>
            <input
              style={s.input}
              type="text"
              placeholder="e.g. CS301"
              value={form.subjectCode}
              onChange={set("subjectCode")}
            />
          </div>
          <div>
            <label style={s.label}>Subject name</label>
            <input
              style={s.input}
              type="text"
              placeholder="e.g. Data Structures"
              value={form.subject}
              onChange={set("subject")}
            />
          </div>
        </div>

        <div style={{ ...s.field, ...s.row }}>
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
        </div>

        <div style={s.field}>
          <label style={s.label}>File (PDF / Image, max 10MB)</label>
          <div
            style={s.dropzone(drag)}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={s.dropText}>Drag & drop or click to select</div>
            <div style={s.dropHint}>PDF, JPG, PNG, WEBP · Max 10MB</div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
          {file && (
            <div style={s.fileChosen}>
              <span style={s.fileName}>✓ {file.name}</span>
              <button style={s.removeBtn} onClick={() => setFile(null)}>
                ✕
              </button>
            </div>
          )}
        </div>

        <button
          style={s.submitBtn(loading)}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload note"}
        </button>
      </div>
    </div>
  );
}
