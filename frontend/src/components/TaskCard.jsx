function TaskCard({ task }) {
  return (
    <div style={{ marginBottom: "8px" }}>
      {task.title}
    </div>
  );
}

export default TaskCard;