import TaskCard from "./TaskCard";

function Column({ column, tasks }) {
  return (
    <div style={{ padding: "10px", border: "1px solid black" }}>
      <h2>{column.name}</h2>

      {tasks?.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
export default Column;