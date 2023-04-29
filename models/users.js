const mongoose = require("mongoose");

const conn = require("../config/db")

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: String,
    gender: String,
    address: String,
    hobbies: String,
    job: String,
    dwh: String,
    phy_ill: String,
    appointments: {
        type: Array,
        "default": [] 
    },
    audio_rec:{
        type: Array,
        "default" : []
    }
})

const User = conn.model("user", userSchema);

module.exports = User;