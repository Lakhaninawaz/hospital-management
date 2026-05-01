const express = require("express");
const { getMyBills, generateBill, downloadBillPdf } = require("../controllers/billController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", protect, getMyBills);
router.post(
  "/generate/:appointmentId",
  protect,
  authorizeRoles("doctor"),
  generateBill
);
router.get("/download/:billId", protect, downloadBillPdf);

module.exports = router;
