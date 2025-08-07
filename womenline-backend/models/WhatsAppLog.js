const mongoose = require('mongoose');

const whatsappLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    phone: { type: String, required: true },
    messageType: { type: String, enum: ['OTP', 'Reminder', 'Notification', 'text'], required: true },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
    sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WhatsAppLog', whatsappLogSchema);
