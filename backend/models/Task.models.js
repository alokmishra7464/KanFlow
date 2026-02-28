import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    board: {type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true},
    column: {type: mongoose.Schema.Types.ObjectId, ref: "Column", required: true},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    order: {type: Number, default: 0}
}, {timestamps: true});

taskSchema.index({ board: 1, column: 1, order: 1});

export const Task = mongoose.model("Task", taskSchema);