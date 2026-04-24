const Appointment = require("../models/Appointment");
const User = require("../models/User");

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const appointmentDate = new Date(date);

    if (!date || Number.isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: "Please select a valid appointment date" });
    }

    if (appointmentDate <= new Date()) {
      return res
        .status(400)
        .json({ message: "Past date appointments are not allowed" });
    }

    const doctor = await User.findById(doctorId);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date: appointmentDate
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

const getAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === "patient") {
      appointments = await Appointment.find({ patientId: req.user._id })
        .populate("patientId", "name email")
        .populate("doctorId", "name specialization")
        .sort({ date: -1 });
    } else {
      appointments = await Appointment.find({ doctorId: req.user._id })
        .populate("patientId", "name email")
        .populate("doctorId", "name specialization")
        .sort({ date: -1 });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (String(appointment.doctorId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Failed to update appointment" });
  }
};

const getDoctorDashboard = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id });
    const patientIds = [...new Set(appointments.map((item) => String(item.patientId)))];
    const patients = await User.countDocuments({ _id: { $in: patientIds } });

    res.json({
      totalPatients: patients,
      totalAppointments: appointments.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getDoctorDashboard
};
