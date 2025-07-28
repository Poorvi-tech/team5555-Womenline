const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const {protect,rolecheck} = require('../middleware/authMiddleware'); // correct path and import

try {
  router.get(
    '/',
    protect,
    rolecheck(['mother', 'caregiver', 'admin', 'user']),
    journalController.getJournals
  );

  router.post(
    '/',
    protect,
    rolecheck(['mother', 'caregiver', 'admin', 'user']),
    journalController.createJournal
  );
} catch (err) {
  console.error('Router Setup Error:', err.message);
}

module.exports = router;
