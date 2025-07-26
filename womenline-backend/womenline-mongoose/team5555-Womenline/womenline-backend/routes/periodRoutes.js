const express = require('express');
const router = express.Router();
const { logPeriod, getPeriodLogs } = require('../controllers/periodController');
const { protect, rolecheck } = require('../middleware/authMiddleware');

router.post(
  '/period-log',
  protect,
  rolecheck(['mother', 'caregiver', 'admin','user']),
  logPeriod
);

router.get(
  '/period-log/:userId',
  protect,
  rolecheck(['mother', 'caregiver', 'admin','user']),
  getPeriodLogs
);

module.exports = router;
