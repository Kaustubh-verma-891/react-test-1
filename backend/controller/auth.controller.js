const jwt = require('jsonwebtoken')
const User = require('../model/user.model');

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "Email already exist." })
        }

        const hashedPassword = await doHash(password, 12);

        const newUser = new User({
            email,
            password: hashedPassword
        })

        const result = await newUser.save();

        result.password = undefined;
        res.status(201).json({
            _id: result._id,
            email: result.email,
        })
    } catch (error) {
        console.error(error);
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email }).select('+password')
        if (!existingUser) {
            return res.status(401).json({ message: "User does not exist." })
        }
        const result = await doHashValidation(password, existingUser.password);
        if (!result) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign({
            userId: existingUser._id,
            userEmail: existingUser.email,
        },
            process.env.jwtTokenSecret,
            {
                expiresIn: '7d'
            })
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        })
        res.status(200).json({
            success: true, user: {
                _id: existingUser._id,
                email: existingUser.email,
            }, message: "Login Successfully"
        })
    } catch (error) {
        console.error(error);
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('jwt').status(200)
            .json({
                success: true,
                message: "Logged out Successfully."
            })
    } catch (error) {
        console.error(error);
    }
}

module.exports = { signup, login, logout }