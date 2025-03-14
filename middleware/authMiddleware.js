const jwt = require("jsonwebtoken");
const Team = require("../models/Team");

module.exports = async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.team = await Team.findById(decoded.id);
    if (!req.team) return res.status(404).json({ message: "Team not found" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
