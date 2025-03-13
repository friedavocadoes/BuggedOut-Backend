const mongoose = require("mongoose");

const JudgeSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model("Judge", JudgeSchema);
