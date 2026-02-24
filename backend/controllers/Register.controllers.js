const bcrypt = require('bcrypt');
const User = require('../models/User.models');

exports.register = async (req, res) => {
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
};