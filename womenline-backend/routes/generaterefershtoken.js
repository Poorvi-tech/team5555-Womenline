const express = require('express');
const router = express.Router();
const { generateRefreshToken } = require('../controllers/refershtoken');  

// Generate a new access token using refresh token
router.post('/refreshtoken', generateRefreshToken);

module.exports = router;
