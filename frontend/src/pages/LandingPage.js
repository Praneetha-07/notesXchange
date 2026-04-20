import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Title */}
      <h1 style={styles.title}>NotesXchange</h1>

      {/* Description */}
      <p style={styles.description}>
        A platform where students can upload, share, and discover useful notes.
        Learn faster, share smarter, and grow together 🚀
      </p>

      {/* Image */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
        alt="notes"
        style={styles.image}
      />

      {/* Button */}
      <button style={styles.button} onClick={() => navigate("/login")}>
        Let's Get Started
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "40px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#1D9E75",
  },
  description: {
    fontSize: "18px",
    maxWidth: "500px",
    color: "var(--text)",
    marginBottom: "20px",
  },
  image: {
    width: "200px",
    marginBottom: "20px",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    background: "#1D9E75",
    color: "white",
    cursor: "pointer",
  },
};

export default LandingPage;
