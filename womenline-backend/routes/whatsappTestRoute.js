// routes/whatsappTestRoute.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const sendWhatsAppMessage = require("../utils/whatsappService");
const formatWhatsAppNumber = require("../utils/formatPhone");

if (process.env.NODE_ENV !== "production") {
  // ✅ Test weekly checklist route (only for dev)
  router.get("/test-weekly-checklist", async (req, res) => {
    try {
      const users = await User.find({ phone: { $exists: true } });
      const checklistMessage = `
🩺 *Weekly Doctor Checklist (TEST)* 🩺

✅ Drink water
✅ Eat healthy
✅ Take medicines
✅ Sleep well
✅ Exercise
✅ Manage stress

- WomenLine
      `;

      for (const user of users) {
        if (!user.phone) continue;
        const formattedPhone = formatWhatsAppNumber(user.phone);
        if (!formattedPhone) continue;
        await sendWhatsAppMessage(formattedPhone, checklistMessage);
      }

      res.json({ success: true, message: "Test weekly checklist sent to all users" });
    } catch (error) {
      console.error("Test checklist error:", error.message);
      res.status(500).json({ success: false, message: "Error sending test message" });
    }
  });
}


// ✅ Inbound WhatsApp auto-reply
router.post("/inbound", async (req, res) => {
  try {
    let from = req.body.From?.trim();
    if (!from) return res.status(400).send("No 'From' number");

    // Ensure correct sandbox format
    if (!from.startsWith("whatsapp:")) from = "whatsapp:" + from;

    const incomingMsg = req.body.Body?.trim().toLowerCase() || "";
    console.log("📞 From:", from, "💬 Msg:", incomingMsg);

    const reply =
      "💜 Thank you for messaging WomenLine!\n\nThis WhatsApp number is only for sending important updates and reminders.\nPlease use our app or website for support.";

    await sendWhatsAppMessage(from, reply);
    res.status(200).send("Inbound message handled");
  } catch (err) {
    console.error("❌ Inbound message error:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
