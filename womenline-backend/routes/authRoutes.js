const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");

// Register a new user
// Endpoint: POST /api/auth/register
router.post("/register", registerUser);

// Login an existing user
// Endpoint: POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;
