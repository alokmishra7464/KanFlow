import express from "express";
import {protect} from "../middlewares/Auth.middlewares.js";
import { createTask, deleteTask } from "../controllers/Task.controllers.js";

const router = express.Router();

router.post("/column/:columnId/task", protect, createTask);
router.delete("/:taskId", protect, deleteTask);

export default router;