const express = require("express");
const router = express.Router();

//const { registerUser, loginUser ,sendOtp,verifyOtp} = require("../controllers/authController");
const authController=require("../controllers/authController");

// Register a new user
// Endpoint: POST /api/auth/register
router.post("/register",authController.registerUser);

// Login an existing user
// Endpoint: POST /api/auth/login
router.post("/login",authController.loginUser);
router.post("/send-otp",authController.sendOtp );
router.post("/verify-otp",authController.verifyOtp);
module.exports = router;
