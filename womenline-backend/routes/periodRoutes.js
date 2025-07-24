const express = require('express');
const router = express.Router();
const { logPeriod, getPeriodLogs } = require('../controllers/periodController');
const authMiddleware = require('../middleware/authMiddleware');

//  Now this matches POST /api/period-log
router.post('/period-log', authMiddleware, logPeriod);

//  This matches GET /api/period-log/:userId
router.get('/period-log/:userId', authMiddleware, getPeriodLogs);

module.exports = router;
