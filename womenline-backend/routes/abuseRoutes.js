const express = require('express');
const router = express.Router();
const abuseController = require('../controllers/abuseController');

// POST /report-abuse (open to all) //
router.post('/report-abuse', abuseController.reportAbuse);

// GET /report-abuse (admin only - add middleware later) //
router.get('/report-abuse', abuseController.getAbuseReports);

module.exports = router;
