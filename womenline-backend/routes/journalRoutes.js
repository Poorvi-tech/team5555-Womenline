const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const {protect,rolecheck} = require('../middleware/authMiddleware'); // correct path and import

router.get('/', protect,rolecheck(['user','admin','mother']), journalController.getJournals);
router.post('/', protect,rolecheck(['user','admin','mother']),  journalController.createJournal);

module.exports = router;
