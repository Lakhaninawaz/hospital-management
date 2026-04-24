const User = require("../models/User");

const getDoctors = async (req, res) => {
  try {
    // Get all doctors from User model
    const doctors = await User.find({ role: "doctor" }).sort({ createdAt: -1 });

    // Format doctors to ensure specialization is always present
    const formattedDoctors = doctors.map((doctor) => ({
      _id: doctor._id,
      name: doctor.name,
      specialization: doctor.specialization || "General Physician",
      email: doctor.email
    }));

    res.json(formattedDoctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

module.exports = { getDoctors };
