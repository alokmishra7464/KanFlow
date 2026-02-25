import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import router from "./routes/Auth.routes.js";

const app = express();
app.use(express.json());

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

app.use("/api/", router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`);
});
