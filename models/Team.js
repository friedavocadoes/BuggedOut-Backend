const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reg_no: { type: Number, required: true, unique: true }, // Unique registration number
  gender: { type: String, enum: ["M", "F"], required: true }, // M or F only
});

const BugSchema = new mongoose.Schema({
  round: { type: Number, required: true },
  category: { type: String, required: true }, // NEW FIELD
  description: { type: String, required: true },
  steps: { type: String, required: true }, // NEW FIELD
  filename: { type: String, required: true }, // NEW FIELD
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  fix: { type: String },
  explanation: { type: String },
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
});

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  members: [MemberSchema],
  stack: { type: String, enum: ["MERN", "NodeJS", "Python"], required: true }, // Added stack field
  blacklisted: { type: Boolean, default: false },
  bugs: [BugSchema],
});

module.exports = mongoose.model("Team", TeamSchema);
