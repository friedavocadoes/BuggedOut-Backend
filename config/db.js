const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_RI)
      .then(() => console.log("MongoDB Connected to " + process.env.MONGO_RI))
      .catch((err) => console.error("MongoDB Connection Error:", err));
  } catch (err) {
    console.error("MongoDB Connection Failed", err);
    process.exit(1);
  }
};

module.exports = connectDB;
