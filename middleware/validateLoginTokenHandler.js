const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401);
        throw new Error("Not authorized: token missing");
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
            algorithms: ["HS256"],
        });
        req.user = decoded.user; // later handlers can read req.user.id
        next();
    } catch (err) {
        res.status(401);
        throw new Error("Not authorized: token invalid or expired");
    }
});

module.exports = validateToken;
