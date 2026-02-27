import express from "express";
import {
    createBoard,
    getBoards,
    getBoardById,
    addMember,
    deleteBoard
} from "../controllers/Board.controllers.js";
import {protect} from "../middlewares/Auth.middlewares.js";

const router = express.Router();

router.post("/", protect, createBoard);
router.get("/", protect, getBoards);
router.get("/:id", protect, getBoardById);
router.post("/:id/members", protect, addMember);
router.delete("/:id", protect, deleteBoard);

export default router;