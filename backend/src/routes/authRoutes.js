const express = require("express");
const { signup, doctorSignup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/doctor-signup", doctorSignup);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
