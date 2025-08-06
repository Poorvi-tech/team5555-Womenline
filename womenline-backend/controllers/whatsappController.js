const { sendWhatsAppMessage } = require('../utils/sendwhatsapp'); 

exports.triggerWhatsApp = async (req, res) => {
  try {
    const response = await sendWhatsAppMessage(req.body); // Dummy trigger
    res.status(200).json({ success: true, message: 'WhatsApp message triggered', response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
