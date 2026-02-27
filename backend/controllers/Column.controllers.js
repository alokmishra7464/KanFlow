import { Column } from "../models/Column.models.js";
import { Board } from "../models/Board.models.js";
import { Task } from "../models/Task.models.js";

// 1. create a column
export const createCol = async(req, res) => {
    try {
        const name = req.body;
        const { boardId } = req.params;

        if(!name) {
            return res.status(400).json({ message: "Column name is required."});
        }
        // finding if board exists or not
        const board = await Board.findById(boardId);
        if(!board) { 
            return res.status(404).json({ message: "Board not found"});
        }

        // if user is allowed to work in board
        const isMember = board.members.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if(!isMember) {
            return res.status(403).json({ message: "You are not a member of this board"});
        }

        // count number of columns already present in board to determine the order for newly created col
        const columnCount = await Column.countDocuments( { board: boardId });

        const column = await Column.create( {
            name,
            board: boardId,
            order: columnCount,
        });

    }
    catch(error) {
        res.status(500).json({ message: error.message});
    }
};

// 2. get all columns by board
export const getAllCols = async(req, res) => {
    try {
        const { boardId } = req.params;
        const board = await Board.findById(boardId);
        if(!board) {
            return res.status(404).json({ message: "Board not found"});
        }
        const isMember = board.members.some(
            (member) => member.toString() === req.user._id.toString()
        );
        if(!isMember) {
            return res.status(403).json({ message: "Not Authorized"});
        }
        // fetch columns in sorted order
        const columns = await Column.find({ board: boardId}).sort({ order: -1});

        res.status(200).json(columns);
    }
    catch(error) {
        res.status(500).json({ message: error.message});
    }
};

// 3. delete a column
export const deleteCol = async(req, res) => {
    try {
        const { columnId } = req.params;

        const column = await Column.findById(columnId);
        if(!column) {
            return res.status(404).json({ message: "Column doesn't exists"});
        }
        // if board exists or not
        const board = await Column.findById(column.board);
        if(!board) {
            return res.status(404).json({ message: "Board not found"});
        }
        // if user is a member or not
        const isMember = board.member.some(
            (member) => member.toString() === req.user._id.toString()
        );
        if(!isMember) {
            return res.status(403).json({ message: "Not Authorized"})
        }
        // check if column contains tasks or not
        const taskCount = await Task.countDocuments( {column: columnId} );
        if(taskCount > 0) {
            return res.status(400).json({ message: "Columns with existing tasks cannot be deleted"});
        }

        await column.deleteOne();
        res.status(200).json({ message: "Column deleted successfully"});
    }
    catch(error) {
        res.status(500).json({ message: error.message});
    }
};