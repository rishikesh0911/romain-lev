const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { validatePassword } = require("../utils/passwordValidator");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

//@desc Register a user
//@route POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body || {};
    if (!userName || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const name = String(userName).trim().toLowerCase();
    if (!/^[a-z0-9_.-]{3,30}$/.test(name)) {
        res.status(400);
        throw new Error("User name must be 3-30 characters: letters, numbers, _ . -");
    }

    const passwordErrors = validatePassword(password, name);
    if (passwordErrors.length > 0) {
        res.status(400);
        throw new Error(passwordErrors.join(". "));
    }

    if (await User.exists({ userName: name })) {
        res.status(400);
        throw new Error("User name is already taken");
    }

    // Store only the hash, never the plain password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    try {
        const user = await User.create({ userName: name, password: hashedPassword });
        res.status(201).json({ status: 1, message: "User registered successfully!", id: user.id, userName: user.userName });
    } catch (err) {
        // Two sign-ups with the same name at the same moment: the unique index catches it
        if (err.code === 11000) {
            res.status(400);
            throw new Error("User name is already taken");
        }
        throw err;
    }
});

//@desc Log in a user
//@route POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body || {};
    if (!userName || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ userName: String(userName).trim().toLowerCase() }).select("+password");
 
    // Same message for "no such user" and "wrong password", so attackers can't tell which user names exist
    if (!user || !(await bcrypt.compare(String(password), user.password))) {
        res.status(401);
        throw new Error("Invalid user name or password");
    }
    const accessToken = jwt.sign(
        { user: { id: user.id, userName: user.userName } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1h" }
    );

    res.status(200).json({ status: 1, message: "Logged in successfully!", accessToken });
});

//@desc Current logged-in user
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };

