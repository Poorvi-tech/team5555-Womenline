const express = require('express');
const router = express.Router();
const abuseController = require('../controllers/abuseController');
const {protect} = require('../middleware/authMiddleware');
// POST /report-abuse (open to all) //
router.post('/report-abuse',protect, abuseController.reportAbuse);

// GET /report-abuse (admin only - add middleware later) //
router.get('/report-abuse',protect, abuseController.getAbuseReports);

module.exports = router;
