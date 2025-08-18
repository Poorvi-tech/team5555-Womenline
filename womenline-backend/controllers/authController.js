const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");
const { sendOtpEmail } = require('../utils/emailService');

let otpStore = {}; 

// Controller for user registration
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      logEvent("❌ REGISTER_FAIL", `Missing fields during registration`);
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logEvent("❌ REGISTER_FAIL", `Attempted registration with existing email: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Fix role to "user" (or any default role)
    const defaultRole = "user";

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: defaultRole,
      greenCredits: 0, // optionally default
    });

    await newUser.save();

    logEvent("✅ REGISTERED", `${newUser.email}`);
    await logAuditTrail("User Registration", JSON.stringify({ email: newUser.email, username: newUser.username }), newUser._id);

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    logEvent("❌ REGISTER_ERROR", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Controller for user login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      logEvent("❌ LOGIN_FAIL", `Missing email or password`);
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logEvent("❌ LOGIN_FAIL", `Invalid email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logEvent("❌ LOGIN_FAIL", `Wrong password for: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    logEvent("✅ LOGIN_SUCCESS", `${user.email}`);
    await logAuditTrail("User Login", JSON.stringify({ email: user.email }), user._id);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    logEvent("❌ LOGIN_ERROR", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for sending OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  const otpExpiryTime = 5 * 60 * 1000;  // 5 minutes
  const otpCreatedAt = Date.now();

  otpStore[email] = {
    otp: otp,
    otpCreatedAt: otpCreatedAt,
    otpExpiryTime: otpExpiryTime
  };

  sendOtpEmail(email, otp);

  return res.status(200).json({ message: 'OTP sent to email' });
};

// Controller for verifying OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const otpData = otpStore[email];

  if (!otpData) {
    return res.status(400).json({ message: 'OTP not sent or expired' });
  }

  const { otp: storedOtp, otpCreatedAt, otpExpiryTime } = otpData;

  if (Date.now() - otpCreatedAt > otpExpiryTime) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP has expired' });
  }

  if (otp === storedOtp) {
    delete otpStore[email];
    return res.status(200).json({ message: 'OTP verified' });
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
};

exports.tokenCheck = async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(400).json({ valid: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, userId: decoded.id, role: decoded.role });
  } catch (error) {
    return res.status(401).json({ valid: false, message: "Invalid token" });
  }
};

// Export otpStore for testing
exports.otpStore = otpStore;
