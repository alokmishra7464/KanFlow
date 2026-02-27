import { Board } from "../models/Board.models.js";
import { User } from "../models/User.models.js";

// 1. create board
export const createBoard = async(req, res) => {
    try {
        const { title } = req.body;

        if(!title) {
            return res.status(400).json({ message: "Title is required"});
        }

        const board = await Board.create( {
            title,
            createdBy: req.user._id,
            members: [req.user._id], // creater becomes the member
        });

        res.status(201).json(board);
    }
    catch(error) {
        res.status(500).json({ message: error.message});
    }
};

// 2. get all boards for user
export const getBoards = async(req, res) => {
    try {
        const boards = await Board.find( {
            members: req.user._id,
        })
            .populate("createdBy", "name email")
            .sort({ createdAt: -1});
        
        res.status(200).json(boards);
    }
    catch(error) {
        res.status(500).json({ message: error.message});
    }
};

//3. get single board
export const getBoardById = async(req, res) => {
    try {
        const board = await Board.findById(req.params.id)
            .populate("members", "name email")
            .populate("createdBy", "name email");
        
        if(!board) {
            return res.status(404).json({ message: "Board not found!"});
        }

        const isMember = board.members.some(
            (member) => member._id.toString() === req.user._id.toString()
        );

        if(!isMember) {
            return res.status(403).json({ message: "Not authorized"});
        }

        res.status(200).json(board);
    }
    catch(error) {
        res.status(500).json({ message: error.message});
    }
};

//4. add users to member list
export const addMember = async(req, res) => {
    try {
        const { email } = req.body;
        const board = await Board.findById(req.params.id);

        if(!board) {
            return res.status(404).json({ message: "Board not found"});
        }

        if(board.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only creator can add members"});
        }

        const userToAdd = await User.findOne({ email });

        if(!userToAdd) {
            return res.status(404).json({ message: "User not found"});
        }

        if(!board.members.includes(userToAdd._id)) {
            board.members.push(userToAdd._id);
            await board.save();
        }
        res.status(200).json(board);
    }
    catch(error) {
        res.status(500).json({ message: error.message});
    }
};

//5. delete board
export const deleteBoard = async(req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if(!board) {
            return res.status(404).json({ message: "Board not found"});
        }
        if(board.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only creator can delete"});
        }

        await board.deleteOne();

        res.status(200).json({ message: "Board deleted"});
    }
    catch(error) {
        res.status(500).json({ message: error.message});
    }
};