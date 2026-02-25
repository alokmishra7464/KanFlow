import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    title: {type: String, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    members: [ { type: mongoose.Schema.Types.ObjectId, ref: "User"} ],

},{timestamps: true});

export const Board  = mongoose.model("Board", boardSchema);