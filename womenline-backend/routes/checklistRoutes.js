const express = require('express');
const router = express.Router();
const { getChecklist, submitChecklist } = require('../controllers/doctorChecklistController');

router.get('/doctor-checklist', getChecklist);  
router.post('/checklist', submitChecklist);    

module.exports = router;
