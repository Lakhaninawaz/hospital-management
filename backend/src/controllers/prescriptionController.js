const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Prescription = require("../models/Prescription");
const { generateBillForAppointment } = require("../services/billService");

const addPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, notes } = req.body;
    const appointment = await Appointment.findById(appointmentId)
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const doctorProfile = await Doctor.findOne({ userId: req.user._id });
    if (String(appointment.doctorId._id) !== String(doctorProfile._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    let prescription = await Prescription.findOne({ appointmentId });

    if (prescription) {
      prescription.medicines = medicines;
      prescription.notes = notes;
      await prescription.save();
    } else {
      prescription = await Prescription.create({
        appointmentId,
        medicines,
        notes
      });
    }

    const bill = await generateBillForAppointment(appointmentId, req.user._id);

    res.status(201).json({ prescription, bill });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Failed to save prescription" });
  }
};

const getMyPrescriptions = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id });
    const appointmentIds = appointments.map((item) => item._id);

    const prescriptions = await Prescription.find({
      appointmentId: { $in: appointmentIds }
    }).populate({
      path: "appointmentId",
      populate: [
        { path: "doctorId", select: "name specialization" },
        { path: "patientId", select: "name email" }
      ]
    });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
};

module.exports = { addPrescription, getMyPrescriptions };
