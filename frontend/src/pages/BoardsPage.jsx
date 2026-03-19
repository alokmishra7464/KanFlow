import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";
import "./BoardsPage.css";

export default function BoardsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getBoards().then(setBoards).catch(console.error);
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const b = await api.createBoard(newTitle.trim());
      setBoards([b, ...boards]);
      setNewTitle("");
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const del = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this board?")) return;
    try {
      await api.deleteBoard(id);
      setBoards(boards.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="boards-root">
      <nav className="boards-nav">
        <div className="nav-brand">
          <span className="brand-mark-sm">◆</span>
          <span className="nav-brand-name">TASKR</span>
        </div>
        <button className="nav-logout" onClick={logout}>
          Sign Out
        </button>
      </nav>

      <main className="boards-main">
        <div className="boards-header">
          <div>
            <h2 className="boards-title">Your Boards</h2>
            <p className="boards-sub">{boards.length} workspace{boards.length !== 1 ? "s" : ""}</p>
          </div>
          <button className="btn-new" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancel" : "+ New Board"}
          </button>
        </div>

        {showForm && (
          <form className="new-board-form" onSubmit={create}>
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Board title…"
              className="new-board-input"
            />
            {error && <span className="form-error">{error}</span>}
            <button className="btn-create" disabled={creating}>
              {creating ? "Creating…" : "Create →"}
            </button>
          </form>
        )}

        <div className="boards-grid">
          {boards.map((b, i) => (
            <div
              key={b._id}
              className="board-card"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => navigate(`/board/${b._id}`)}
            >
              <div className="board-card-top">
                <span className="board-card-num">{String(i + 1).padStart(2, "0")}</span>
                <button className="board-del" onClick={(e) => del(b._id, e)} title="Delete">
                  ×
                </button>
              </div>
              <h3 className="board-card-title">{b.title}</h3>
              <div className="board-card-meta">
                <span>by {b.createdBy?.name || "—"}</span>
                <span>{b.members?.length || 0} member{b.members?.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="board-card-arrow">→</div>
            </div>
          ))}

          {boards.length === 0 && (
            <div className="boards-empty">
              <p>No boards yet. Create your first one.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
