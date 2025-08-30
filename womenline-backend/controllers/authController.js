const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");
const { sendOtpEmail } = require('../utils/emailService');
const formatWhatsAppNumber = require("../utils/formatPhone");
const sendWhatsAppMessage = require("../utils/whatsappService");

let otpStore = {}; 

// Controller for user registration
exports.registerUser = async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    if (!username || !email || !password || !phone) {
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

    // Fix role to "user" 
    const defaultRole = "user";

    const newUser = new User({
      username,
      email,
      password,
       phone,
      role: defaultRole,
      greenCredits: 0,
      isVerified: false
    });

    await newUser.save();

     // OTP generate + store
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = {
      otp,
      otpCreatedAt: Date.now(),
      otpExpiryTime: 5 * 60 * 1000
    };

    await sendOtpEmail(email, otp);

    logEvent("📧 REGISTER_OTP_SENT", `OTP sent to ${email}`);
    await logAuditTrail("User Registration Pending OTP", JSON.stringify({ email, username }), newUser._id);

    res.status(201).json({
      message: "User registered. Please verify OTP sent to email.",
      email
    });
  } catch (error) {
    console.error("Register error:", error);
    logEvent("❌ REGISTER_ERROR", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP (activate account)
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const otpData = otpStore[email];
  if (!otpData) return res.status(400).json({ message: "OTP not sent or expired" });

  const { otp: storedOtp, otpCreatedAt, otpExpiryTime } = otpData;

  if (Date.now() - otpCreatedAt > otpExpiryTime) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (otp === storedOtp) {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

     user.isVerified = true;
    await user.save();

    delete otpStore[email];

    logEvent("✅ OTP_VERIFIED", `${email} verified successfully`);
    await logAuditTrail("User OTP Verified", JSON.stringify({ email }), user._id);

    //  WhatsApp Welcome message
    if (user.phone) {
      const formattedPhone = formatWhatsAppNumber(user.phone);
      await sendWhatsAppMessage(
        formattedPhone,
        `Hello ${user.username}, 🎉 your account has been verified successfully!`
      );
    }

    return res.status(200).json({ message: "OTP verified. Account activated!" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
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

  // ✅ Send WhatsApp notification after login
if (user.phone) {
  const formattedPhone = formatWhatsAppNumber(user.phone);
  await sendWhatsAppMessage(
    formattedPhone,
    `Hello ${user.username}, you have successfully logged in ✅`
  );
}

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

// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = {
      otp,
      otpCreatedAt: Date.now(),
      otpExpiryTime: 5 * 60 * 1000, // 5 minutes
    };

    // Send OTP Email
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Forgot Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password using OTP
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const otpData = otpStore[email];
    if (!otpData) {
      return res.status(400).json({ message: "OTP not sent or expired" });
    }

    // Validate OTP
    const { otp: storedOtp, otpCreatedAt, otpExpiryTime } = otpData;
    if (Date.now() - otpCreatedAt > otpExpiryTime) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP has expired" });
    }
    if (otp !== storedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP valid → update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // OTP hatado
    delete otpStore[email];

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};