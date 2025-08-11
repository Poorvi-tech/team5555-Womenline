const express = require('express');
const router = express.Router();
const { generateRefreshToken } = require('../controllers/refershtoken');  // assuming you rename export above

// @route   POST /api/auth/refreshtoken
// @desc    Generate a new access token using refresh token
router.post('/refreshtoken', generateRefreshToken);

module.exports = router;
