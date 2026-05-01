const Appointment = require("../models/Appointment");
const Bill = require("../models/Bill");
const createBillPdf = require("../utils/createBillPdf");

const generateBillForAppointment = async (appointmentId, userId, role) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate("patientId", "name email")
    .populate("doctorId", "name specialization");

  if (!appointment) {
    const error = new Error("Appointment not found");
    error.statusCode = 404;
    throw error;
  }

  // Verify doctor access to this appointment
  if (role === "doctor") {
    if (String(appointment.doctorId._id) !== String(userId)) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }
  }

  const amount = 650;
  const pdfUrl = await createBillPdf({
    appointment,
    patientName: appointment.patientId.name,
    doctorName: appointment.doctorId.name,
    amount
  });

  const bill = await Bill.findOneAndUpdate(
    { appointmentId },
    { appointmentId, amount, pdfUrl },
    { upsert: true, new: true }
  ).populate({
    path: "appointmentId",
    populate: [
      { path: "doctorId", select: "name specialization" },
      { path: "patientId", select: "name email" }
    ]
  });

  return bill;
};

module.exports = { generateBillForAppointment };
