const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect, rolecheck } = require("../middleware/authMiddleware");
const { uploadVoiceEntry } = require("../controllers/voiceController");

// Storage config for voice uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/voice"),
  filename: (req, file, cb) => {
    const uniqueName = `voice-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// POST /api/voice/upload
router.post(
  "/upload",
  protect,
  rolecheck(["mother", "caregiver", "admin", "user"]),
  upload.single("voiceFile"),
  uploadVoiceEntry
);

module.exports = router;
