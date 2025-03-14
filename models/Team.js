const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reg_no: { type: Number, required: true, unique: true }, // Unique registration number
  gender: { type: String, enum: ["M", "F"], required: true }, // M or F only
});

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Team password
  members: [MemberSchema], // Array of members with detailed structure
  blacklisted: { type: Boolean, default: false }, // Blacklist status
});

module.exports = mongoose.model("Team", TeamSchema);
