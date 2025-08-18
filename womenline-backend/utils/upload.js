const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Directory to store uploaded file
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + unique + ext);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  // Allow images, audio, pdf — adjust as needed
  const allowed = /\.(jpg|jpeg|png|gif|mp3|wav|m4a|pdf)$/i;
  if (allowed.test(file.originalname)) cb(null, true);
  else cb(new Error("Unsupported file type"), false);
};

// Multer upload instance with storage, size limit, and filter
const upload = multer({
  storage,
  limits: {
    fileSize:
      (process.env.MAX_UPLOAD_MB
        ? parseInt(process.env.MAX_UPLOAD_MB, 10)
        : 5) *
      1024 *
      1024,
  },
  fileFilter,
});

module.exports = upload;
