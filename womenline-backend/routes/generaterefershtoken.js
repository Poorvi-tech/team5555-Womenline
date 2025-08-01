const express = require('express');
const router = express.Router();
const refersgtoken = require('..controllers/refershtoken.js')
router.post('/refershtoken',refersgtoken);