const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { protect } = require('../middleware/authMiddleware'); // Middleware for protected routes

// Export user's journal summary as PDF (Requires Authentication)
router.get('/export-summary', protect, exportController.exportSummary);

// Download a sample health summary PDF (Public Access)
router.get('/sample', exportController.samplePdf);

module.exports = router;
