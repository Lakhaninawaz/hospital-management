const Appointment = require("../models/Appointment");
const Bill = require("../models/Bill");
const { generateBillForAppointment } = require("../services/billService");
const createBillPdf = require("../utils/createBillPdf");

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

const downloadBillPdf = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.billId).populate({
      path: "appointmentId",
      populate: [
        { path: "doctorId", select: "name specialization" },
        { path: "patientId", select: "name email" }
      ]
    });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // Verify user has access to this bill
    if (req.user.role === "patient") {
      if (String(bill.appointmentId.patientId._id) !== String(req.user._id)) {
        return res.status(403).json({ message: "Access denied" });
      }
    } else if (req.user.role === "doctor") {
      if (String(bill.appointmentId.doctorId._id) !== String(req.user._id)) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    // Generate PDF on-demand
    const pdfBuffer = await createBillPdf({
      appointment: bill.appointmentId,
      patientName: bill.appointmentId.patientId.name,
      doctorName: bill.appointmentId.doctorId.name,
      amount: bill.amount
    });

    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", `attachment; filename="bill-${bill._id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to download bill" });
  }
};

module.exports = { getMyBills, generateBill, downloadBillPdf };
