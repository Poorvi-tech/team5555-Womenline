const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/voice');
  },
  filename: function (req, file, cb) {
    const uniqueName = `voice-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// 📌 Upload voice file
router.post('/upload', upload.single('voiceFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No voice file uploaded' });
  }

  res.status(200).json({
    success: true,
    message: 'Voice file uploaded successfully',
    filePath: req.file.path
  });
});

module.exports = router;
