const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { protect } = require('../middleware/authMiddleware'); 

// Export journal summary as PDF (protected)
router.get('/export-summary', protect, exportController.exportSummary);

module.exports = router;
