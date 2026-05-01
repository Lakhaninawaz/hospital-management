const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const prescriptionRoutes = require("./src/routes/prescriptionRoutes");
const billRoutes = require("./src/routes/billRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");

dotenv.config();

const app = express();
const uploadsDir = path.join(__dirname, "uploads", "bills");

// Create uploads directory if it doesn't exist (local development only)
if (process.env.NODE_ENV !== "production" && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
// Serve uploaded files (local development only)
if (process.env.NODE_ENV !== "production") {
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
}

app.get("/", (req, res) => {
  res.json({ message: "Hospital Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    // In development, exit. In production, start server anyway for health checks
    if (process.env.NODE_ENV === "production") {
      console.warn("Starting server without database connection");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (without DB)`);
      });
    } else {
      process.exit(1);
    }
  });
