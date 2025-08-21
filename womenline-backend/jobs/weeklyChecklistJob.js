// jobs/weeklyChecklistJob.js
const cron = require("node-cron");
const User = require("../models/User");
const sendWhatsAppMessage = require("../utils/whatsappService");
const formatWhatsAppNumber = require("../utils/formatPhone");

// === Weekly Doctor Checklist Job ===
const startWeeklyChecklistJob = () => {
  // Runs every Sunday at 10:00 AM server time
  cron.schedule("0 10 * * 0", async () => {
    console.log("⏰ Sending weekly doctor checklist to all users...");

    try {
      const users = await User.find({ phone: { $exists: true } });

      const checklistMessage = `
🩺 *Weekly Doctor ChecklistTest* 🩺

✅ Drink 2-3 liters of water daily
✅ Maintain a balanced diet
✅ Take prescribed medicines
✅ Track your sleep (7-8 hours)
✅ Do light physical activity
✅ Keep stress levels in check
✅ Schedule follow-up if needed

- WomenLine
      `;

      for (const user of users) {
        if (!user.phone) continue;

        const formattedPhone = formatWhatsAppNumber(user.phone);
        if (!formattedPhone) continue;

        try {
          await sendWhatsAppMessage(formattedPhone, checklistMessage);
        } catch (err) {
          console.error(`❌ Failed to send to ${user.phone}:`, err.message);
        }
      }

      console.log("✅ Weekly checklist messages sent successfully.");
    } catch (error) {
      console.error("❌ Error sending weekly checklist:", error.message);
    }
  });
};

module.exports = startWeeklyChecklistJob;
