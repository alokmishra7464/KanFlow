import { useState } from "react";
import TaskCard from "./TaskCard";
import * as api from "../api";
import "./Column.css";

export default function KanbanColumn({ column, tasks, members, onTasksChange, onDeleteColumn, onTaskMove }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "" });
  const [adding, setAdding] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const addTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setAdding(true);
    try {
      const task = await api.createTask(
        column._id,
        form.title.trim(),
        form.description.trim(),
        form.assignedTo || undefined
      );
      onTasksChange(column._id, [...tasks, task]);
      setForm({ title: "", description: "", assignedTo: "" });
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.deleteTask(taskId);
      onTasksChange(column._id, tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task._id);
    e.dataTransfer.setData("srcColId", column._id);
    e.dataTransfer.setData("srcIndex", task.order);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const taskId = e.dataTransfer.getData("taskId");
    const srcColId = e.dataTransfer.getData("srcColId");
    if (!taskId) return;
    const newIndex = tasks.length;
    onTaskMove(taskId, srcColId, column._id, newIndex);
  };

  return (
    <div
      className={`kanban-col ${dragOver ? "drag-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="col-header">
        <div className="col-header-left">
          <span className="col-count">{tasks.length}</span>
          <h3 className="col-name">{column.name}</h3>
        </div>
        <div className="col-actions">
          <button className="col-add-btn" onClick={() => setShowForm(!showForm)} title="Add task">
            {showForm ? "✕" : "+"}
          </button>
          <button
            className="col-del-btn"
            onClick={() => onDeleteColumn(column._id)}
            title="Delete column"
          >
            ⋯
          </button>
        </div>
      </div>

      {showForm && (
        <form className="task-form" onSubmit={addTask}>
          <input
            autoFocus
            className="task-input"
            placeholder="Task title…"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="task-input task-textarea"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
          />
          {members && members.length > 0 && (
            <select
              className="task-input task-select"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          )}
          <div className="task-form-actions">
            <button type="submit" className="btn-add-task" disabled={adding}>
              {adding ? "Adding…" : "Add Task"}
            </button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="col-tasks">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={deleteTask}
            onDragStart={handleDragStart}
          />
        ))}
        {tasks.length === 0 && !showForm && (
          <div className="col-empty">Drop tasks here</div>
        )}
      </div>
    </div>
  );
}
