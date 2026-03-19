import "./TaskCard.css";

export default function TaskCard({ task, onDelete, onDragStart }) {
  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task)}
    >
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        <button
          className="task-del"
          onClick={() => onDelete(task._id)}
          title="Delete task"
        >
          ×
        </button>
      </div>
      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}
      {task.assignedTo && (
        <div className="task-assignee">
          <span className="assignee-dot" />
          <span className="assignee-name">
            {typeof task.assignedTo === "object"
              ? task.assignedTo.name || task.assignedTo.email
              : "Assigned"}
          </span>
        </div>
      )}
    </div>
  );
}
