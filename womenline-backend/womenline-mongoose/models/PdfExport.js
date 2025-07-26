const mongoose = require('mongoose');

const pdfExportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exportType: {
        type: String,
        required: true
    },
    exportedAt: {
        type: Date,
        default: Date.now
    }
});

const PdfExport = mongoose.model('PdfExport', pdfExportSchema);
module.exports = PdfExport;