const mongoose = require('mongoose');

// Schema to log PDF export activities by users
const pdfExportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    },
    exportType: {
        type: String, // e.g., 'summary-report', 'health-summary'
        required: true
    },
    exportedAt: {
        type: Date,  // Timestamp when PDF was exported
        default: Date.now
    }
});

const PdfExport = mongoose.model('PdfExport', pdfExportSchema);
module.exports = PdfExport;