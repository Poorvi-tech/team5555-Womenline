const twilio = require("twilio");
require("dotenv").config();

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = "whatsapp:" + process.env.TWILIO_WHATSAPP_FROM;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Send WhatsApp Message via Twilio
async function sendWhatsAppMessage(toNumber, message) {
  try {
    // Create and send message
    const response = await client.messages.create({
      from: whatsappFrom,
      to: "whatsapp:" + toNumber,
      body: message,
    });
    console.log("✅ WhatsApp sent:", response.sid);
    return response.sid;
  } catch (err) {
    console.error("❌ WhatsApp error:", err.message);
    throw err;
  }
}

module.exports = {
  sendWhatsAppMessage,
};
