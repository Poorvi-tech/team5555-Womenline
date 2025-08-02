const multer = require("multer");
const path = require("path");

// Allowed file extensions and MIME types for validation
const allowedExtensions = [".jpg", ".png", ".pdf"];
const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

// Storage configuration: destination & unique filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in 'uploads/' directory
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// File filter to validate extension, MIME type, and prevent double extensions
const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  const hasDoubleExtension = file.originalname.split('.').length > 2;

  if (
    allowedExtensions.includes(ext) &&
    allowedMimeTypes.includes(mime) &&
    !file.originalname.includes("..") &&
    !hasDoubleExtension
  ) {
    cb(null, true); // Valid file
  } else {
    cb(new Error("File type not allowed")); // Invalid file
  }
};

// Multer instance with storage, file filter, and size limit (5MB)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
