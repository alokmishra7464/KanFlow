import { useState, useEffect } from 'react';
import api from '../services/api';
import Column from '../components/Column';
import TaskCard from '../components/TaskCard';

function BoardPage() {
    const [columns, setColumns] = useState([]);
    const [taskMap, setTaskMap] = useState({});

    const boardId = "69a1505a245f0d6ee3110abc";

    const fetchColumns = async () => {
        try {
            const res = await api.get(`/column/${boardId}`);
            setColumns(res.data);
            const tasksData = {};
            for (let col of res.data) {
                const taskRes = await api.get(`/tasks/${col._id}`);
                tasksData[col._id] = taskRes.data;
            }

            setTaskMap(tasksData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchColumns();
    }, []);

    return (
        <div style={{ display: "flex", gap: "20px" }}>
            {columns.map((col) => (
                <Column
                    key={col._id}
                    column={col}
                    tasks={taskMap[col._id]}
                />
            ))}
        </div>
    );
}

export default BoardPage;