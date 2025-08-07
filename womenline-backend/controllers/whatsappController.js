const sendWhatsApp = require("../utils/sendWhatsApp");
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");
const WhatsAppLog = require("../models/WhatsAppLog");

// ✅ Final API controller function
exports.triggerWhatsApp = async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      logEvent("❗WHATSAPP_MISSING_FIELDS", `Phone or message not provided`);
      await logAuditTrail(
        "WhatsApp Send Failed",
        "Missing phone or message field",
        req.user?.id || "unknown"
      );
      return res.status(400).json({
        success: false,
        message: "Phone and message are required.",
      });
    }

    const sid = await sendWhatsApp.sendWhatsAppMessage(phone, message);

    const log = new WhatsAppLog({
      userId: req.user.id,
      phone,
      messageType: "text",
      status: "sent",
      sentAt: new Date(),
    });
    await log.save();

    logEvent("✅ WHATSAPP_SENT", `WhatsApp sent to ${phone}`, req.user?.id || "unknown");
    await logAuditTrail("WhatsApp Sent", `WhatsApp message sent to ${phone}`, req.user?.id || "unknown");

    res.status(200).json({ success: true, message: "WhatsApp sent", sid });
  } catch (err) {
    logEvent(
      "❌ WHATSAPP_SEND_FAILED",
      `Failed to send WhatsApp to ${req.body.phone}: ${err.message}`,
      req.user?.id || "unknown"
    );
    await logAuditTrail("WhatsApp Send Error", err.message, req.user?.id || "unknown");

    res.status(500).json({ success: false, message: "Failed to send WhatsApp", error: err.message });
  }
};

