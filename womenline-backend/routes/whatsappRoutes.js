const express = require("express");
const router = express.Router();
const sendWhatsApp = require("../utils/sendWhatsApp");
const logEvent = require("../utils/logger");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/whatsapp/send-whatsapp
// @desc    Send WhatsApp message to user (protected)
// @access  Authenticated users only
router.post("/send-whatsapp", protect, async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    logEvent("❗WHATSAPP_MISSING_FIELDS", `Phone or message not provided`);
    return res
      .status(400)
      .json({ success: false, message: "phone and message are required" });
  }

  try {
    // Send WhatsApp message via utility function
    const sid = await sendWhatsApp.sendWhatsAppMessage(phone, message); //  from object
    res.status(200).json({ success: true, message: "WhatsApp sent", sid });
  } catch (err) {
    logEvent(
      "❌ WHATSAPP_SEND_FAILED",
      `Failed to send WhatsApp to ${phone}: ${err.message}`,
      req.user?.id || "unknown"
    );
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send WhatsApp",
        error: err.message,
      });
  }
});

module.exports = router;
