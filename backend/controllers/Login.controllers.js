const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.models');

exports.login = async (req, res) => {
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
};