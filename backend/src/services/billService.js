const Appointment = require("../models/Appointment");
const Bill = require("../models/Bill");
const Doctor = require("../models/Doctor");
const createBillPdf = require("../utils/createBillPdf");

const generateBillForAppointment = async (appointmentId, doctorUserId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate("patientId", "name email")
    .populate("doctorId", "name specialization");

  if (!appointment) {
    const error = new Error("Appointment not found");
    error.statusCode = 404;
    throw error;
  }

  if (doctorUserId) {
    const doctorProfile = await Doctor.findOne({ userId: doctorUserId });

    if (!doctorProfile || String(appointment.doctorId._id) !== String(doctorProfile._id)) {
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
