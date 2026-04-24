import React, { useState } from "react";
import API from "../api/axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

function CreateNote() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");

  const handleSubmit = async () => {
    if (
      !title ||
      !content ||
      !subject ||
      !subjectCode ||
      !semester ||
      !branch
    ) {
      alert("All fields are required");
      return;
    }

    try {
      await API.post("/notes", {
        title,
        content,
        subject,
        subjectCode,
        semester,
        branch,
      });

      alert("Note published!");
      navigate("/browse"); // ✅ VERY IMPORTANT
    } catch (err) {
      alert("Error publishing note");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>✍️ Write Note</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Subject"
          onChange={(e) => setSubject(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Subject Code"
          onChange={(e) => setSubjectCode(e.target.value)}
          style={styles.input}
        />

        <div style={styles.row}>
          <select
            onChange={(e) => setSemester(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Semester</option>
            <option>Sem 1</option>
            <option>Sem 2</option>
            <option>Sem 3</option>
            <option>Sem 4</option>
            <option>Sem 5</option>
            <option>Sem 6</option>
          </select>

          <select
            onChange={(e) => setBranch(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Branch</option>
            <option>CSE</option>
            <option>ECE</option>
            <option>IT</option>
            <option>MECH</option>
            <option>CIVIL</option>
            <option>EEE</option>
          </select>
        </div>

        <div style={styles.editor}>
          <ReactQuill value={content} onChange={setContent} />
        </div>

        <button style={styles.button} onClick={handleSubmit}>
          🚀 Publish Note
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "var(--bg-color)",
    minHeight: "100vh",
  },
  card: {
    width: "100%",
    maxWidth: "850px",
    background: "var(--surface)",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },
  heading: {
    marginBottom: "20px",
    color: "var(--text)",
    fontSize: "22px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #e5e3dc",
    marginBottom: "12px",
    background: "var(--surface)",
    color: "var(--text)",
    outline: "none",
  },
  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "12px",
  },
  select: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e3dc",
    fontSize: "14px",
    background: "var(--surface)",
    color: "var(--text)",
    outline: "none",
    cursor: "pointer",
  },
  editor: {
    marginTop: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#1D9E75",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "0.2s",
  },
};

export default CreateNote;
