const express = require("express");
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getDoctorDashboard
} = require("../controllers/appointmentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAppointments);
router.post("/", protect, authorizeRoles("patient"), createAppointment);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("doctor"),
  updateAppointmentStatus
);
router.get(
  "/dashboard/summary",
  protect,
  authorizeRoles("doctor"),
  getDoctorDashboard
);

module.exports = router;
