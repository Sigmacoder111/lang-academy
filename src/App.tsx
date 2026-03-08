import { useState, useEffect } from "react";
import StudySession from "./components/StudySession";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        transition: "background 0.3s ease",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
          padding: "1.25rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Lang Academy
        </h1>
        <button
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "13px",
            fontWeight: 500,
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            borderRadius: "0.5rem",
            padding: "0.375rem 0.75rem",
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--border)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {darkMode ? "Light" : "Dark"}
        </button>
      </header>

      {/* Main content */}
      <main style={{ paddingBottom: "3rem", paddingTop: "1rem" }}>
        <StudySession />
      </main>
    </div>
  );
}

export default App;
