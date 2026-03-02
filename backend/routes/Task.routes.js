import express from "express";
import {protect} from "../middlewares/Auth.middlewares.js";
import { createTask, deleteTask, getTasksByCols } from "../controllers/Task.controllers.js";

const router = express.Router();

router.post("/column/:columnId/task", protect, createTask);
router.delete("/:taskId", protect, deleteTask);
router.get("/:columnId", protect, getTasksByCols);

export default router;