const Doctor = require("../models/Doctor");

const getDoctors = async (req, res) => {
  try {
    // Get all doctors from Doctor model
    const doctors = await Doctor.find().select("-password").sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

module.exports = { getDoctors };
