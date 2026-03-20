import socket from "../socket";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import KanbanColumn from "../components/KanbanColumn";
import * as api from "../api";
import "./BoardPage.css";

export default function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [taskMap, setTaskMap] = useState({}); // { colId: [tasks] }
  const [newColName, setNewColName] = useState("");
  const [showColForm, setShowColForm] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberError, setMemberError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, cols] = await Promise.all([
          api.getBoardById(id),
          api.getColumns(id),
        ]);
        setBoard(b);
        setColumns(cols);

        const tasks = await Promise.all(
          cols.map((c) => api.getTasksByColumn(c._id))
        );
        const map = {};
        cols.forEach((c, i) => (map[c._id] = tasks[i]));
        setTaskMap(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
  if (!id) return;

  // Connect and join board room
  socket.connect();
  socket.emit("join-board", id);

  // Listen for real-time events
  socket.on("task-created", ({ columnId, task }) => {
    setTaskMap((prev) => ({
      ...prev,
      [columnId]: [...(prev[columnId] || []), task],
    }));
  });

  socket.on("task-deleted", ({ taskId, columnId }) => {
    setTaskMap((prev) => ({
      ...prev,
      [columnId]: (prev[columnId] || []).filter((t) => t._id !== taskId),
    }));
  });

  socket.on("task-moved", ({ taskId, srcColId, destColId, newIndex }) => {
    setTaskMap((prev) => {
      const srcTasks = [...(prev[srcColId] || [])];
      const destTasks = srcColId === destColId
        ? srcTasks
        : [...(prev[destColId] || [])];

      const movedTask = srcTasks.find((t) => t._id === taskId);
      if (!movedTask) return prev;

      const newSrc = srcTasks.filter((t) => t._id !== taskId);
      const newDest = srcColId === destColId ? newSrc : destTasks;
      newDest.splice(newIndex, 0, { ...movedTask, column: destColId });

      return {
        ...prev,
        [srcColId]: newSrc,
        [destColId]: newDest,
      };
    });
  });

  // Cleanup on unmount
  return () => {
    socket.emit("leave-board", id);
    socket.off("task-created");
    socket.off("task-deleted");
    socket.off("task-moved");
    socket.disconnect();
  };
}, [id]);

  const addColumn = async (e) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    try {
      const col = await api.createColumn(id, newColName.trim());
      setColumns([...columns, col]);
      setTaskMap({ ...taskMap, [col._id]: [] });
      setNewColName("");
      setShowColForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteColumn = async (colId) => {
    if (!confirm("Delete this column? (Only works if empty)")) return;
    try {
      await api.deleteColumn(colId);
      setColumns(columns.filter((c) => c._id !== colId));
      const m = { ...taskMap };
      delete m[colId];
      setTaskMap(m);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTasksChange = (colId, newTasks) => {
    setTaskMap((prev) => ({ ...prev, [colId]: newTasks }));
  };

  const handleTaskMove = async (taskId, srcColId, destColId, newIndex) => {
    try {
      await api.moveTask(taskId, destColId, newIndex);

    } catch (err) {
      alert(err.message);
    }
    };

  const addMember = async (e) => {
    e.preventDefault();
    setMemberError("");
    try {
      const updated = await api.addMember(id, memberEmail.trim());
      setBoard(updated);
      setMemberEmail("");
      setShowMemberForm(false);
    } catch (err) {
      setMemberError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="board-loading">
        <span className="loading-dot" />
        <span className="loading-dot" style={{ animationDelay: "0.15s" }} />
        <span className="loading-dot" style={{ animationDelay: "0.3s" }} />
      </div>
    );
  }

  return (
    <div className="board-root">
      <nav className="board-nav">
        <div className="nav-left">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Boards
          </button>
          <span className="nav-sep">|</span>
          <h1 className="board-nav-title">{board?.title}</h1>
        </div>
        <div className="nav-right">
          <div className="members-chips">
            {board?.members?.slice(0, 4).map((m) => (
              <div key={m._id} className="member-chip" title={m.email}>
                {m.name?.charAt(0).toUpperCase()}
              </div>
            ))}
            {board?.members?.length > 4 && (
              <div className="member-chip member-chip-more">
                +{board.members.length - 4}
              </div>
            )}
          </div>
          <button className="btn-member" onClick={() => setShowMemberForm(!showMemberForm)}>
            + Member
          </button>
          <button className="nav-logout" onClick={logout}>
            Sign Out
          </button>
        </div>
      </nav>

      {showMemberForm && (
        <div className="member-bar">
          <form className="member-form" onSubmit={addMember}>
            <input
              autoFocus
              className="member-input"
              type="email"
              placeholder="member@email.com"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
            />
            {memberError && <span className="form-error">{memberError}</span>}
            <button className="btn-add-member" type="submit">
              Add →
            </button>
            <button type="button" className="btn-cancel-sm" onClick={() => setShowMemberForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="board-canvas">
        {columns.map((col) => (
          <KanbanColumn
            key={col._id}
            column={col}
            tasks={taskMap[col._id] || []}
            members={board?.members || []}
            onTasksChange={handleTasksChange}
            onDeleteColumn={deleteColumn}
            onTaskMove={handleTaskMove}
          />
        ))}

        <div className="add-col-area">
          {showColForm ? (
            <form className="add-col-form" onSubmit={addColumn}>
              <input
                autoFocus
                className="col-name-input"
                placeholder="Column name…"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
              />
              <div className="col-form-actions">
                <button type="submit" className="btn-col-create">Create</button>
                <button type="button" className="btn-cancel-sm" onClick={() => setShowColForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button className="btn-add-col" onClick={() => setShowColForm(true)}>
              <span>+</span> Add Column
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
