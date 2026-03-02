import { Task } from "../models/Task.models.js";
import { Board } from "../models/Board.models.js";
import { Column } from "../models/Column.models.js";

//1. create tasks
export const createTask = async(req, res) => {
    try {
        const { title, description, assignedTo } = req.body;
        const { columnId } = req.params;
        if(!title) {
            return res.status(400).json({ message: "Title is required"});
        }
        // if board , column  & assigned person exists
        const column = await Column.findById(columnId);
        if(!column) {
            return res.status(404).json({ message: "Column not found"});
        }

        const board = await Board.findById(column.board);
        if(!board) {
            return res.status(404).json({ message: "Board not found"});
        }

        const isMember = board.members.some(
            (member) => req.user._id.toString() === member.toString()
        );
        if(!isMember) {
            return res.status(403).json({ message: "Not authorized"});
        }

        if(assignedTo) {
            let isValid = board.members.some(
                (member) => member.toString() === assignedTo
            );
            if(!isValid) {
                return res.status(404).json({ message: "Assigned member not in board"});
            }
        }

        const taskCount = await Task.countDocuments({ column: columnId});

        const task = await Task.create( {
            title,
            description,
            board: board._id,
            column: columnId,
            assignedTo,
            order: taskCount,
        });
        res.status(201).json(task);
    }
    catch(error) {
        res.status(500).json({ message: error.message});
    }
};

// delete task
export const deleteTask = async(req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if(!task) {
            return res.status(404).json({ message: "Task not found"});
        }
        
        const board = await Board.findById(task.board);
        if(!board) {
            return res.status(404).json({ message: "Board not found"});
        }
        const isMember = board.members.some(
            (member) => req.user._id.toString() === member.toString()
        );
        if(!isMember) {
            return res.stauts(403).json({ message: "Not Authorized to delete task"});
        }

        await task.deleteOne();

        res.status(200).json({ message: "Task Deleted!!!"});

    }
    catch(error) {
        res.status(500).json({ message: error.message});
    }
};

// get tasks by columns
export const getTasksByCols = async(req, res) => {
    try {
        const { columnId } = req.params;
        const column = await Column.findById(columnId);
        if(!column) {
            return res.status(404).json({ message: "Column not found"});
        }
        const board = await Board.findById(column.board);
        if(!board) {
            return res.status(404).json({ message: "Board not found"});
        }
        const isMember = board.members.some(
            (member) => req.user._id.toString() === member.toString()
        );
        if(!isMember) {
            return res.status(403).json({ message: "Not authorized"})
        }

        const tasks = await Task.findById({ column: columnId}).sort({ order: 1});

        res.status(200).json(tasks);
    }
    catch(error) {
        res.stauts(500).json({ message: error.message});
    }
};