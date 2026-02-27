import { Column } from "../models/Column.models.js";
import { Board } from "../models/Board.models.js";

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