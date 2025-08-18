const express = require("express");
const router = express.Router();
const authController=require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Register new user
router.post("/register",authController.registerUser);

// Login user
router.post("/login",authController.loginUser);

// Send OTP
router.post("/send-otp",authController.sendOtp );

// Verify OTP
router.post("/verify-otp",authController.verifyOtp);

// Token check (protected)
router.get("/token-check", protect, authController.tokenCheck);

module.exports = router;
