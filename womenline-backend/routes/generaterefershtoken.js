const express = require('express');
const router = express.Router();
const refersgtoken = require('..controllers/refershtoken.js')

// @route   POST /api/auth/refreshtoken
// @desc    Generate a new access token using refresh token
router.post('/refershtoken',refersgtoken);

module.exports = router;