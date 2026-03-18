import React from 'react'
import { useState } from 'react'

function BoardPage() {
    const [columns, setColumns] = useState([
        {_id: "1", name: "Todo"},
        {_id: "2", name: "Doing"},
        {_id: "3", name: "Done"}
    ]);

    const [taskMap, setTaskMap] = useState({
        "1": [{ _id: "t1", title: "Task A"}],
        "2": [{ _id: "t2", title: "Task B"}],
        "3": []
    });

  return (
    <div style={{ display: "flex", gap: "20px" }}>
        {columns.map((col) => (
            <div key={col._id} style={{ padding: "10px", border: "1px solid black" }}>
                <h2>{col.name}</h2>

                {taskMap[col._id]?.map((task) => (
                    <div key={task._id}>{task.title}</div>
                ))}
            </div>
        ))}
    </div>
  )
}

export default BoardPage