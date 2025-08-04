const mongoose = require('mongoose');

const whatsappLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    phone: { type: String, required: true },
    messageType: { type: String, enum: ['text', 'image', 'video', 'audio'], required: true },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WhatsAppLog', whatsappLogSchema);
