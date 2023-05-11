const mongoose = require("mongoose");

const conn = require("../config/db")

const depression_dataSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      depression_label: {
        type: String,
        required: true
      },
      time_stamp: {
        type: String,
        required: true
      }
})

const Depression_data = conn.model("depression_data", depression_dataSchema);

module.exports = Depression_data;