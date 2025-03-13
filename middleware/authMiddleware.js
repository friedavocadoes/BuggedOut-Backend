const jwt = require("jsonwebtoken");
const Team = require("../models/Team");

exports.authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.team = await Team.findById(verified.id);
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
