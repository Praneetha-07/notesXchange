import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const s = {
  card: {
    // background: "#fff",
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid #e5e3dc",
    borderRadius: "12px",
    padding: "16px 18px",
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    transition: "border-color 0.15s",
  },
  voteCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    minWidth: "38px",
    paddingTop: "2px",
  },
  voteBtn: (active, type) => ({
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    border: `1px solid ${active ? (type === "upvote" ? "#5DCAA5" : "#F0997B") : "#e5e3dc"}`,
    background: active
      ? type === "upvote"
        ? "#E1F5EE"
        : "#FAECE7"
      : "transparent",
    color: active ? (type === "upvote" ? "#0F6E56" : "#993C1D") : "#a09e97",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    transition: "all 0.15s",
  }),
  voteCount: {
    fontSize: "14px",
    fontWeight: "500",
    // color: "#1a1a18",
    color: "var(--text)",
    lineHeight: 1,
  },
  body: { flex: 1 },
  title: {
    fontSize: "15px",
    fontWeight: "500",
    // color: "#1a1a18",
    color: "var(--text)",
    marginBottom: "8px",
    lineHeight: 1.4,
  },
  badges: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "8px",
  },
  badge: (color) => {
    const map = {
      blue: { bg: "#E6F1FB", color: "#185FA5" },
      green: { bg: "#EAF3DE", color: "#3B6D11" },
      purple: { bg: "#EEEDFE", color: "#534AB7" },
      amber: { bg: "#FAEEDA", color: "#854F0B" },
    };
    return {
      fontSize: "11px",
      padding: "2px 9px",
      borderRadius: "100px",
      fontWeight: "500",
      background: map[color].bg,
      color: map[color].color,
    };
  },
  meta: { fontSize: "12px", color: "#a09e97" },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "flex-end",
    flexShrink: 0,
  },
  dlBtn: {
    padding: "5px 14px",
    borderRadius: "8px",
    border: "1px solid #e5e3dc",
    background: "transparent",
    fontSize: "13px",
    color: "var(--text)",
    cursor: "pointer",
    transition: "all 0.15s",
    textDecoration: "none",
    display: "inline-block",
  },
  dleBtn: {
    padding: "5px 14px",
    borderRadius: "8px",
    border: "1px solid #e5e3dc",
    background: "transparent",
    fontSize: "13px",
    color: "#6b6960",
    cursor: "pointer",
    transition: "all 0.15s",
    textDecoration: "none",
    display: "inline-block",
  },
  fileTag: (type) => ({
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "100px",
    background: type === "pdf" ? "#FCEBEB" : "#EAF3DE",
    color: type === "pdf" ? "#A32D2D" : "#3B6D11",
    fontWeight: "500",
  }),
};

export default function NoteCard({ note, onVoteUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [voting, setVoting] = useState(false);
  const [localNote, setLocalNote] = useState(note);
  const [message, setMessage] = useState("");

  const handleVote = async (type) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (voting) return;
    setVoting(true);
    try {
      const { data } = await api.post(`/votes/${localNote._id}`, {
        voteType: type,
      });
      const updated = {
        ...localNote,
        voteCount: data.voteCount,
        userVote: data.userVote,
      };
      setLocalNote(updated);

      if (data.userVote === null) {
        setMessage("Vote removed");
      } else if (data.userVote === "upvote") {
        setMessage("Upvoted 👍");
      } else {
        setMessage("Downvoted 👎");
      }

      setTimeout(() => setMessage(""), 2000);

      if (onVoteUpdate) onVoteUpdate(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  const uploaderName = localNote.uploadedBy?.name || "Unknown";
  const uploaderInitials = uploaderName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const date = new Date(localNote.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleDelete = async () => {
    try {
      await api.delete(`/notes/${note._id}`);
      alert("Note deleted");
      window.location.reload(); // simple refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={s.card}>
      <div style={s.voteCol}>
        <button
          style={s.voteBtn(localNote.userVote === "upvote", "upvote")}
          onClick={() => handleVote("upvote")}
          title="Upvote"
        >
          ▲
        </button>
        <span style={s.voteCount}>{localNote.voteCount}</span>
        <button
          style={s.voteBtn(localNote.userVote === "downvote", "downvote")}
          onClick={() => handleVote("downvote")}
          title="Downvote"
        >
          ▼
        </button>
      </div>

      <div style={s.body}>
        <div style={s.title}>{localNote.title}</div>
        {message && (
          <div
            style={{ fontSize: "12px", color: "#1D9E75", marginBottom: "6px" }}
          >
            {message}
          </div>
        )}
        <div style={s.badges}>
          <span style={s.badge("blue")}>{localNote.semester}</span>
          <span style={s.badge("green")}>
            {localNote.subjectCode} · {localNote.subject}
          </span>
          <span style={s.badge("purple")}>{localNote.branch}</span>
          {localNote.fileType && (
            <span style={s.fileTag(localNote.fileType)}>
              {localNote.fileType.toUpperCase()}
            </span>
          )}
        </div>
        <div style={s.meta}>
          {uploaderInitials} {uploaderName} · {date}
        </div>
      </div>

      <div style={s.actions}>
        <a
          href={`http://localhost:5001${localNote.fileUrl}`}
          target="_blank"
          rel="noreferrer"
          style={s.dlBtn}
        >
          Download
        </a>
      </div>
      {user && user._id === localNote.uploadedBy?._id && (
        <button style={s.dleBtn} onClick={handleDelete}>
          Delete
        </button>
      )}
      {/* <button style={s.dlBtn} onClick={handleDelete}>
        Delete
      </button> */}
    </div>
  );
}
