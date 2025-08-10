// Core Imports
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

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

// CORS Configuration (Frontend URLs Whitelisted)
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

// Middleware - Body Parser (JSON Requests)
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
const AuditLog = require('./models/AuditLog'); // Import AuditLog model

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
app.use('/api', checklistRoutes); // Doctor Checklist API

// Health Check Route
app.get("/", (req, res) => {
  res.send("WomenLine backend is running");
});

// Middleware to log actions (example for reward redemption)
app.use(async (req, res, next) => {
  res.on('finish', async () => {
    const userId = req.user ? req.user.id : null; // Assuming user ID is available in req.user
    if (req.path.includes('/api/rewards/redeem')) {
      await AuditLog.logRewardRedemption(userId, req.body.rewardId);
    } else if (req.path.includes('/api/forum')) {
      if (req.method === 'POST') {
        await AuditLog.logForumPost(userId, req.body.postId);
      } else if (req.method === 'POST' && req.path.includes('/reply')) {
        await AuditLog.logForumReply(userId, req.body.postId);
      }
    } else if (req.path.includes('/api/voice')) {
      await AuditLog.logVoiceChatInteraction(userId, req.body.interactionDetails);
    }
  });
  next();
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export app for Testing Purposes
module.exports = app;
