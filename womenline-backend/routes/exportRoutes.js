// routes/exportRoutes.js
const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// ✅ Route to download summary
router.get('/export-summary', exportController.exportSummary);

// ✅ NEW Route to download sample
router.get('/sample', exportController.samplePdf);

module.exports = router;
