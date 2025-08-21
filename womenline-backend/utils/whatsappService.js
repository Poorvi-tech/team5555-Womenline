const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsAppMessage = async (to, message) => {
  try {
    console.log("📤 Sending message to:", to);
    const response = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`, // your Twilio sandbox number
      to: to, // must be exactly like "whatsapp:+9190xxxxxxx"
      body: message,
    });
    console.log("✅ WhatsApp Message Sent:", response.sid);
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error.message);
  }
};

module.exports = sendWhatsAppMessage;
