const express = require("express");
const router = express.Router();
const sendWhatsAppMessage = require("../utils/sendWhatsApp");

// Dummy API: send test WhatsApp to your number
router.post("/send-whatsapp", async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ success: false, message: "phone and message are required" });
  }

  try {
    const result = await sendWhatsAppMessage(phone, message);
    res.status(200).json({ success: true, message: "WhatsApp sent", sid: result.sid });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send WhatsApp", error: err.message });
  }
});

module.exports = router;
