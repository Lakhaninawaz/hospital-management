const Appointment = require("../models/Appointment");
const Bill = require("../models/Bill");
const { generateBillForAppointment } = require("../services/billService");

const getMyBills = async (req, res) => {
  try {
    let bills = [];

    if (req.user.role === "patient") {
      const appointments = await Appointment.find({ patientId: req.user._id });
      const appointmentIds = appointments.map((item) => item._id);
      bills = await Bill.find({ appointmentId: { $in: appointmentIds } }).populate({
        path: "appointmentId",
        populate: [
          { path: "doctorId", select: "name specialization" },
          { path: "patientId", select: "name email" }
        ]
      });
    } else {
      // For doctor role, get appointments where doctor is the doctor
      const appointments = await Appointment.find({ doctorId: req.user._id });
      const appointmentIds = appointments.map((item) => item._id);
      bills = await Bill.find({ appointmentId: { $in: appointmentIds } }).populate({
        path: "appointmentId",
        populate: [
          { path: "doctorId", select: "name specialization" },
          { path: "patientId", select: "name email" }
        ]
      });
    }

    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bills" });
  }
};

const generateBill = async (req, res) => {
  try {
    const bill = await generateBillForAppointment(req.params.appointmentId, req.user._id, req.user.role);
    res.status(201).json(bill);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Failed to generate bill" });
  }
};

module.exports = { getMyBills, generateBill };
