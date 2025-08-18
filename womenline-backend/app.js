// ===== Core Imports =====
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

// ===== Database =====
const connectDB = require("./config/db");

// ===== Logger =====
const logEvent = require("./utils/logger");

// ===== Express App Initialization =====
const app = express();
app.use(express.json());
app.use(helmet()); // Secure HTTP headers

// ===== HTTP Logging =====
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logEvent("HTTP", message.trim()),
    },
  })
);

// ===== Folder Setup =====
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const voicePath = path.join(__dirname, "uploads/voice");
if (!fs.existsSync(voicePath)) {
  fs.mkdirSync(voicePath, { recursive: true });
}

// ===== CORS Setup =====
const allowedOrigins = [
  "http://localhost:8000", // local frontend
  "https://women-line-frontend.vercel.app", // live deployed frontend
];
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

// ===== Rate Limiting =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // per IP
  message: { message: "Too many requests, please try again later." },
});
app.use(limiter);

// ===== Connect Database =====
connectDB();

// ===== Import Routes =====
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
const appointmentRoutes = require("./routes/appointmentRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const leaderboardRoutes = require("./routes/leaderboard");

// ===== Mount Routes =====
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/pdf", exportRoutes);
app.use("/api", maCoinRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api", periodRoutes);
app.use("/api/abuse", abuseRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", checklistRoutes);

// ===== Static File Hosting =====
app.use(
  "/uploads/voice",
  express.static(path.join(__dirname, "uploads/voice"))
);
app.use("/uploads/pdf", express.static(path.join(__dirname, "uploads")));

// ===== Test / Dummy Routes =====
app.get("/error-test", (req, res, next) => {
  next(new Error("Test error logging"));
});
app.get("/test-success", (req, res) => {
  res.json({ success: true, message: "Test route working fine " });
});
app.get("/", (req, res) => {
  res.send("WomenLine backend is running");
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// ===== Error Handler =====
app.use(errorHandler);

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ===== Export for Testing =====
module.exports = app;
