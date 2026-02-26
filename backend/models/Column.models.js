import mongoose from "mongoose"

const columnSchema = new mongoose.Schema({
    name: {type: String, required: true},
    board: {type: mongoose.Schema.Types.ObjectId, ref: Board, required: true},
    order: {type: Number, required: true, default: 0},

}, {timestamps: true});

columnSchema.index({ board: 1, order: 1});

export const Column = mongoose.model("Column", columnSchema);