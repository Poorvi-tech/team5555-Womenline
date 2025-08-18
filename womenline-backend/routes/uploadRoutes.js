const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect, rolecheck } = require("../middleware/authMiddleware");

// Upload file (image/pdf) - mother, caregiver, admin, user
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
