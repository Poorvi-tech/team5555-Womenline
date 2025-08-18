const express = require('express');
const router = express.Router();
const { getChecklist, submitChecklist } = require('../controllers/doctorChecklistController');
const { protect, rolecheck } = require('../middleware/authMiddleware');

// Get doctor checklist
router.get('/doctor-checklist', protect, getChecklist);

// Submit checklist (admin & doctor)
router.post('/checklist', protect, rolecheck(['admin', 'doctor']), submitChecklist);

module.exports = router;
