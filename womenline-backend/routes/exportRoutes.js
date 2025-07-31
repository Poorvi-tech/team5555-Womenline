const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

//get export-summary
router.get('/export-summary', exportController.exportSummary); 

module.exports = router;
