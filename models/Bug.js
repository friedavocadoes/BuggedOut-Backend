const mongoose = require("mongoose");

const BugSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  round: { type: Number, required: true }, // 1 or 2
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  score: { type: Number, default: 0 }, // Judges will assign a score
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bug", BugSchema);
