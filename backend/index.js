require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected !!!");
    }
    catch(error) {
        console.log("DB connection failed.", error);
    }
}

connectDB();

app.get("/", (req, res) => {
    res.send("This is home page");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`);
});
