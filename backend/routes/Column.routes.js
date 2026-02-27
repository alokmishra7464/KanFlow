import express from "express";
import { createCol, getAllCols, deleteCol } from "../controllers/Column.controllers.js";
import { protect } from "../middlewares/Auth.middlewares.js";

const router = express.Router();

router.post("/:boardId", protect, createCol);
router.get("/:boardId", protect, getAllCols);
router.delete("/:columnId", protect, deleteCol);

export default router;