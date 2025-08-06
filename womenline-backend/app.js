// Core Imports
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// MongoDB Models (Optional Direct Import if Needed)
const {
  PeriodLog,
  Rewards,
  Journal,
  AbuseReport,
  ForumPost,
  PdfExport,
  Appointment,
  Forum,
  Reply,
  VoiceEntry,
  WhatsAppLog
} = require("./models");

// Database Connection
const connectDB = require("./config/db");

// Logger Utility
const logEvent = require("./utils/logger");

// Initialize Express App
const app = express();

// Folder Setup: Ensure 'uploads' and 'uploads/voice' directories exist
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const voicePath = path.join(__dirname, "uploads/voice");
if (!fs.existsSync(voicePath)) {
  fs.mkdirSync(voicePath, { recursive: true });
}

//  CORS Configuration (Frontend URLs Whitelisted)
const allowedOrigins = [
  "http://localhost:8000", // local frontend
  "https://yourfrontend.com", // live deployed frontend
];

// Secure CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

//  Middleware - Body Parser (JSON Requests)
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes Import
const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const maCoinRoutes = require("./routes/maCoinRoutes");
const exportRoutes = require("./routes/exportRoutes");
const periodRoutes = require("./routes/periodRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const abuseRoutes = require("./routes/abuseRoutes");
const forumRoutes = require("./routes/forumRoutes");
const appointmentRoutes = require('./routes/appointmentRoutes');
const checklistRoutes = require('./routes/checklistRoutes');

// Route Handlers
app.use("/api/voice", voiceRoutes); // Voice Upload APIs
app.use("/api/whatsapp", whatsappRoutes); // WhatsApp with Dummy Trigger APIs
app.use("/api/pdf", exportRoutes); // PDF Export APIs
app.use("/api", maCoinRoutes); // MaCoin (Credits) APIs
app.use("/api/rewards", rewardRoutes); // Rewards API
app.use("/api/upload", uploadRoutes); // File Upload APIs
app.use("/api/auth", authRoutes); // Authentication APIs
app.use("/api/journals", journalRoutes); // Journal APIs
app.use("/api", periodRoutes); // Period Tracker APIs
app.use("/api/abuse", abuseRoutes); // Abuse Reporting APIs
app.use("/api/forum", forumRoutes); // Forum APIs
app.use('/api', appointmentRoutes); // Appointment Booking APIs
app.use('/api', checklistRoutes); //  Doctor Checklist API

// Health Check Route
app.get("/", (req, res) => {
  res.send("WomenLine backend is running");
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export app for Testing Purposes
module.exports = app;
