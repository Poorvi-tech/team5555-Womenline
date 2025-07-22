const multer = require("multer");
const path = require("path");

const allowedExtensions = [".jpg", ".png", ".pdf"];
const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  // 🚫 Check for double extension (e.g., "file.jpg.exe")
  const hasDoubleExtension = file.originalname.split('.').length > 2;

  if (
    allowedExtensions.includes(ext) &&
    allowedMimeTypes.includes(mime) &&
    !file.originalname.includes("..") &&
    !hasDoubleExtension
  ) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
