const express = require('express');
const router = express.Router();
const { getChecklist, submitChecklist } = require('../controllers/doctorChecklistController');
const { protect, rolecheck } = require('../middleware/authMiddleware');

router.get('/doctor-checklist', protect, getChecklist);
router.post('/checklist', protect, rolecheck(['admin', 'doctor']), submitChecklist);

module.exports = router;
