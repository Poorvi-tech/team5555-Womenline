const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect, rolecheck } = require("../middleware/authMiddleware");

// @route   POST /api/upload/file
// @desc    Upload a file (image/pdf)
// @access  Protected (mother, caregiver, admin, user)
router.post(
  "/file",
  protect,
  rolecheck(["mother", "caregiver", "admin", "user"]),
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "File not uploaded" });
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: req.file.filename,
    });
  }
);

module.exports = router;
