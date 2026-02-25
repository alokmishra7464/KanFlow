import bcrypt from "bcrypt";
import { User } from "../models/User.models.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        const userExists = await User.findOne( { email });
        if(userExists) {
            return res.status(400).json({message : "User already exists!"});
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const user = await User.create( {
            name,
            email,
            password: hashedPass
        });

        res.status(201).json({ message: "User Created Successfully!!!"});
    }
    catch(error) {
        res.status(500).json({ message: "Internal Server Error!"});
    }
    
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "User doesn't exists!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json("Wrong Password!!!");
        }
        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.json({ token });
    }
    catch(error) {
        res.status(500).json("Internal Server Error!")
    }
};

