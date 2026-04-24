const express = require("express");
const {
  addPrescription,
  getMyPrescriptions
} = require("../controllers/prescriptionController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("doctor"), addPrescription);
router.get("/my", protect, authorizeRoles("patient"), getMyPrescriptions);

module.exports = router;
