const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = 'whatsapp:' + process.env.TWILIO_WHATSAPP_FROM;

const client = twilio(accountSid, authToken);

async function sendWhatsAppMessage(toNumber, message) {
  try {
    const response = await client.messages.create({
      from: whatsappFrom,
      to: 'whatsapp:' + toNumber, // E.g., 'whatsapp:+9198XXXXXXX'
      body: message,
    });
    console.log('✅ WhatsApp sent:', response.sid);
    return response.sid;
  } catch (err) {
    console.error('❌ WhatsApp error:', err.message);
    throw err;
  }
}

module.exports = sendWhatsAppMessage;
