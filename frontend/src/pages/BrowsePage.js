import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import NoteCard from "../components/NoteCard";
import { useAuth } from "../context/AuthContext";

const s = {
  page: { maxWidth: "860px", margin: "0 auto", padding: "1.5rem 1.25rem" },
  header: { marginBottom: "1.25rem" },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    // color: "#1a1a18",
    color: "var(--text)",
    marginBottom: "4px",
  },
  subtitle: { fontSize: "14px", color: "#6b6960" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "1.25rem",
  },
  statCard: {
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid #e5e3dc",
    borderRadius: "10px",
    padding: "14px 16px",
  },
  statLabel: { fontSize: "12px", color: "var(--text)", marginBottom: "4px" },
  statVal: { fontSize: "24px", fontWeight: "600", color: "var(--text)" },
  filters: {
    // background: "#fff",
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid #e5e3dc",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "1rem",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchWrap: { flex: 1, minWidth: "200px", position: "relative" },
  searchIcon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    // color: "#a09e97",
    color: "var(--text)",
    fontSize: "15px",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "8px 12px 8px 32px",
    border: "1px solid #e5e3dc",
    borderRadius: "8px",
    fontSize: "14px",
    // background: "#f5f4f0",
    // color: "#1a1a18",
    background: "var(--surface)",
    color: "var(--text)",
    outline: "none",
  },
  select: {
    padding: "8px 10px",
    border: "1px solid #e5e3dc",
    borderRadius: "8px",
    fontSize: "14px",
    // background: "#f5f4f0",
    // color: "#1a1a18",
    background: "var(--surface)",
    color: "var(--text)",
    cursor: "pointer",
    outline: "none",
  },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  empty: {
    textAlign: "center",
    padding: "4rem 1rem",
    // color: "#a09e97",
    color: "var(--text)",
    fontSize: "15px",
  },
  loading: {
    textAlign: "center",
    padding: "3rem",
    // color: "#a09e97",
    color: "var(--text)",
  },
  pagination: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    marginTop: "1.5rem",
    alignItems: "center",
  },
  pageBtn: (active) => ({
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1px solid #e5e3dc",
    background: active ? "#1D9E75" : "var(--surface)",
    color: active ? "#fff" : "var(--text)",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: active ? "500" : "400",
  }),
  error: {
    // background: "#FAECE7",
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid #F0997B",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#993C1D",
    fontSize: "14px",
    marginBottom: "1rem",
  },
};

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

export default function BrowsePage() {
  const [notes, setNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [sort, setSort] = useState("votes");

  const { user } = useAuth();

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { sort, page };
      if (search) params.search = search;
      if (semester) params.semester = semester;
      if (branch) params.branch = branch;
      const { data } = await api.get("/notes", { params });
      setNotes(data.notes);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      setError("Failed to load notes. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [search, semester, branch, sort, page]);

  useEffect(() => {
    const timer = setTimeout(fetchNotes, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchNotes, search]);

  const handleVoteUpdate = (updated) => {
    setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
  };

  const myNotes = notes.filter((note) => note.uploadedBy?._id === user?._id);

  const otherNotes = notes.filter((note) => note.uploadedBy?._id !== user?._id);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}>Study Materials</div>
        <div style={s.subtitle}>Find and share notes, sorted by quality</div>
      </div>

      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Total notes</div>
          <div style={s.statVal}>{total}</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Subjects</div>
          <div style={s.statVal}>12</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statLabel}>Branches</div>
          <div style={s.statVal}>{BRANCHES.length}</div>
        </div>
      </div>

      <div style={s.filters}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>⌕</span>
          <input
            style={s.input}
            type="text"
            placeholder="Search by title, subject code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          style={s.select}
          value={semester}
          onChange={(e) => {
            setSemester(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All semesters</option>
          {SEMESTERS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          style={s.select}
          value={branch}
          onChange={(e) => {
            setBranch(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All branches</option>
          {BRANCHES.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <select
          style={s.select}
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
        >
          <option value="votes">Top rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {error && <div style={s.error}>{error}</div>}

      {loading ? (
        <div style={s.loading}>Loading notes...</div>
      ) : notes.length === 0 ? (
        <div style={s.empty}>
          No notes found. Try different filters or be the first to upload!
        </div>
      ) : (
        <div style={s.list}>
          {/* ✅ Notes you added */}
          {user && myNotes.length > 0 && (
            <>
              <h3 style={{ margin: "10px 0" }}>Notes you added</h3>
              {myNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onVoteUpdate={handleVoteUpdate}
                />
              ))}
            </>
          )}

          {/* ✅ All other notes */}
          <h3 style={{ margin: "15px 0 5px" }}>All Notes</h3>
          {otherNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onVoteUpdate={handleVoteUpdate}
            />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div style={s.pagination}>
          <button
            style={s.pageBtn(false)}
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              style={s.pageBtn(p === page)}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            style={s.pageBtn(false)}
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
