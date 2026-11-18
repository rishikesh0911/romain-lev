const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "Please add the user name"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Please add the password"],
            select: false, // never returned by queries unless asked for with .select("+password")
        },
    },
    {
        timestamps: true,
    }
);

// "User" model -> stored in the "users" collection
module.exports = mongoose.model("User", userSchema);
