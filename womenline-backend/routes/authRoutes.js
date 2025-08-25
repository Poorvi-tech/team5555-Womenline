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

// Forgot & Reset Password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
