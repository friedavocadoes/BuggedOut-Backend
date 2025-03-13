const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  members: [{ type: String }], // Array of team members' names
  blacklisted: { type: Boolean, default: false }, // Blacklist status
});

module.exports = mongoose.model("Team", TeamSchema);
