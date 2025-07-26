const mongoose = require('mongoose');

const abuseReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for anonymous reports
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for querying abuse reports by type
abuseReportSchema.index({ type: 1 });

const AbuseReport = mongoose.model('AbuseReport', abuseReportSchema);
module.exports = AbuseReport;