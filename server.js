const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bugs", require("./routes/bugRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/judges", require("./routes/judgeRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
