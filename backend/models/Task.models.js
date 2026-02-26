import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    board: {type: mongoose.Schema.Types.ObjectId, ref: Board},
    column: {type: mongoose.Schema.Types.ObjectId, ref: Column},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: User},
    order: {type: Number}
}, {timestamps: true});

export const Task = mongoose.model("Task", taskSchema);