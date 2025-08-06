const express = require('express');
const router = express.Router();
const { getChecklist } = require('../controllers/doctorChecklistController');

router.get('/doctor-checklist', getChecklist);

module.exports = router;
