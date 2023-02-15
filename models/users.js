const mongoose = require("mongoose");

const conn = require("../config/db")

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
})

const User = conn.model("user", userSchema);

module.exports = User;