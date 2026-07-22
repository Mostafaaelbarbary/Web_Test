import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function isThisWeek(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  return d >= weekAgo && d <= now;
}

function initialsOf(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      <td><span className="skeleton-block" style={{ width: "70%" }} /></td>
      <td><span className="skeleton-block" style={{ width: "85%" }} /></td>
      <td><span className="skeleton-block" style={{ width: "60%" }} /></td>
      <td><span className="skeleton-block" style={{ width: "50%" }} /></td>
      <td><span className="skeleton-block" style={{ width: "55%" }} /></td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="dashboard-empty">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
        <path d="M8 13h.01M12 13h4" />
      </svg>
      <h3>No entries yet</h3>
      <p>Once people sign up, their details will show up here.</p>
    </div>
  );
}

function DashboardPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch(`${API_URL}/api/entries`);
        if (!res.ok) throw new Error("Failed to load entries");
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        setError("Could not load entries. Is the server running?");
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  const total = entries.length;
  const thisWeek = entries.filter((e) => isThisWeek(e.created_at)).length;
  const latest = entries[0]?.name || "—";

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-logo">
          <img src="/genz-logo.png" alt="GenZ" />
        </Link>
        <Link to="/" className="btn-primary dashboard-home-btn">
          Home
        </Link>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <p className="eyebrow">Dashboard</p>
          <h1>Submitted entries</h1>
          <p className="form-subtitle">
            Every account created through the sign-up form, newest first.
          </p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <p className="stat-label">Total entries</p>
            <p className="stat-value">{loading ? "—" : total}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">New this week</p>
            <p className="stat-value">{loading ? "—" : thisWeek}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Most recent</p>
            <p className="stat-value stat-value--text">{loading ? "—" : latest}</p>
          </div>
        </div>

        {error && <ul className="form-errors"><li>{error}</li></ul>}

        {!error && !loading && entries.length === 0 && <EmptyState />}

        {!error && (loading || entries.length > 0) && (
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Birthday</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  : entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>
                          <div className="entry-name-cell">
                            <span className="entry-avatar">{initialsOf(entry.name)}</span>
                            {entry.name}
                          </div>
                        </td>
                        <td>{entry.email}</td>
                        <td>{entry.phone}</td>
                        <td>{formatDate(entry.birthday)}</td>
                        <td>{formatDate(entry.created_at)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;