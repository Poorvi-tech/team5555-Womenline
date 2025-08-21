// utils/formatPhone.js
const formatWhatsAppNumber = (phone) => {
  if (!phone) return null;

  let formatted = phone.toString().trim();

  // Ensure number starts with +
  if (!formatted.startsWith("+")) {
    formatted = "+" + formatted;
  }

  // Twilio Sandbox expects whatsapp: prefix only for API
  return `whatsapp:${formatted}`;
};

module.exports = formatWhatsAppNumber;
