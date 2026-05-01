const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const generateToken = require("../utils/generateToken");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered as patient" });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Email already registered as doctor" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isApproved: true
    });

    res.status(201).json({
      token: generateToken(user._id, "patient"),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "patient"
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
};

const doctorSignup = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered as patient" });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Email already registered as doctor" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      specialization,
      isApproved: true
    });

    res.status(201).json({
      token: generateToken(doctor._id, "doctor"),
      user: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: "doctor"
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Doctor signup failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Login as patient
    if (role === "patient") {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (!user.isApproved) {
        return res.status(403).json({ message: "Account pending approval" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      return res.json({
        token: generateToken(user._id, "patient"),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: "patient"
        }
      });
    }

    // Login as doctor
    if (role === "doctor") {
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (!doctor.isApproved) {
        return res.status(403).json({ message: "Account pending approval" });
      }

      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      return res.json({
        token: generateToken(doctor._id, "doctor"),
        user: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          role: "doctor"
        }
      });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { signup, doctorSignup, login, getMe };
