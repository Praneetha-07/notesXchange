import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const styles = {
  nav: {
    // background: "#ffffff",
    background: "var(--surface)",
    color: "var(--text)",
    borderBottom: "1px solid #e5e3dc",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "56px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "600",
    fontSize: "16px",
    // color: "#1a1a18",
    color: "var(--text)",
    textDecoration: "none",
  },
  toggleBtn: {
    marginLeft: "10px",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
    cursor: "pointer",
  },
  dot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "#1D9E75",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  link: (active) => ({
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: active ? "500" : "400",
    color: active ? "#1a1a18" : "var(--text)",
    background: active ? "#f5f4f0" : "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.15s",
  }),
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#E1F5EE",
    color: "#0F6E56",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    fontSize: "12px",
  },
  logoutBtn: {
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    // color: "#6b6960",
    color: "var(--text)",
    background: "transparent",
    border: "1px solid #e5e3dc",
    cursor: "pointer",
  },
  authBtn: {
    padding: "6px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    background: "#1D9E75",
    // color: "#fff",
    color: "var(--text-inverted)",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { theme, toggleTheme } = useContext(ThemeContext);

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <div style={styles.dot} />
        NotesXchange
      </Link>

      <div style={styles.links}>
        <Link to="/browse" style={styles.link(path === "/browse")}>
          Browse
        </Link>
        {user && (
          <Link to="/upload" style={styles.link(path === "/upload")}>
            Upload
          </Link>
        )}
      </div>

      <div style={styles.right}>
        <button onClick={toggleTheme} style={styles.toggleBtn}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {user ? (
          <>
            <div style={styles.avatar}>{initials}</div>
            <span style={{ fontSize: "13px", color: "#6b6960" }}>
              {user.name.split(" ")[0]}
            </span>
            <button
              style={styles.logoutBtn}
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link(false)}>
              Sign in
            </Link>
            <Link to="/register" style={styles.authBtn}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
