const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: {type: String, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    members: [ { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] } ],

},{timestamps: true});

module.exports = mongoose.model("Board", boardSchema);