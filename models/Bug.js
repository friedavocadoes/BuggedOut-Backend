const mongoose = require("mongoose");

const BugSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
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
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bug", BugSchema);
