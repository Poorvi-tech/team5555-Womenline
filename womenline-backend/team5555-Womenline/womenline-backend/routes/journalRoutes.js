const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const protect = require('../middleware/authMiddleware'); // correct path and import

router.get('/', protect, journalController.getJournals);
router.post('/', protect, journalController.createJournal);

module.exports = router;
