const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to find as patient first
    let user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = { ...user._doc, role: "patient" };
      return next();
    }

    // Try to find as doctor
    let doctor = await Doctor.findById(decoded.id).select("-password");
    if (doctor) {
      req.user = { ...doctor._doc, role: "doctor" };
      return next();
    }

    return res.status(401).json({ message: "User not found" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

module.exports = { protect, authorizeRoles };
