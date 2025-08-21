const express = require('express');
const router = express.Router();
const { getChecklist, submitChecklist, updateChecklist, deleteChecklist } = require('../controllers/doctorChecklistController');
const { protect, rolecheck } = require('../middleware/authMiddleware');

// Get doctor checklist (all users)
router.get('/doctor-checklist', protect, getChecklist);

// Submit checklist (admin & doctor)
router.post('/checklist', protect, rolecheck(['admin', 'doctor']), submitChecklist);

// Update checklist (admin only)
router.put('/checklist/:id', protect, rolecheck(['admin']), updateChecklist);

// Delete checklist (admin only)
router.delete('/checklist/:id', protect, rolecheck(['admin']), deleteChecklist);

module.exports = router;
