const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");

const getNotifications = async (req, res) => {
  try {
    if (req.user.role === "patient") {
      const appointments = await Appointment.find({ patientId: req.user._id })
        .populate("doctorId", "name")
        .sort({ updatedAt: -1 });
      const prescriptions = await Prescription.find({
        appointmentId: { $in: appointments.map((item) => item._id) }
      }).sort({ updatedAt: -1 });

      const messages = [
        ...appointments
          .filter((appointment) => appointment.doctorId) // Filter out null doctorId
          .map((appointment) => ({
            id: `appointment-${appointment._id}`,
            message:
              appointment.status === "accepted"
                ? `Appointment confirmed with ${appointment.doctorId.name}`
                : appointment.status === "rejected"
                ? `Appointment rejected by ${appointment.doctorId.name}`
                : `Appointment is pending with ${appointment.doctorId.name}`,
            date: appointment.updatedAt
          })),
        ...prescriptions.map((prescription) => ({
          id: `prescription-${prescription._id}`,
          message: "Prescription added by doctor",
          date: prescription.updatedAt
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      return res.json(messages);
    }

    const pendingAppointments = await Appointment.find({
      doctorId: req.user._id,
      status: "pending"
    })
      .populate("patientId", "name")
      .sort({ createdAt: -1 });

    const messages = pendingAppointments
      .filter((appointment) => appointment.patientId) // Filter out null patientId
      .map((appointment) => ({
        id: `pending-${appointment._id}`,
        message: `New appointment request from ${appointment.patientId.name}`,
        date: appointment.createdAt
      }));

    res.json(messages);
  } catch (error) {
    console.error("Notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

module.exports = { getNotifications };
