const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");

// Controller for user registration
exports.registerUser = async (req, res) => {
  const { username, email, password, role, greenCredits } = req.body;

  try {
    // Validate required fields
    if (!username || !email || !password) {
      logEvent("❌ REGISTER_FAIL", `Missing fields during registration`);
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logEvent(
        "❌ REGISTER_FAIL",
        `Attempted registration with existing email: ${email}`
      );
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user instance
    const newUser = new User({
      username,
      email,
      password,
      role,
      greenCredits,
    });

    await newUser.save();

    logEvent("✅ REGISTERED", `${newUser.email}`);
    await logAuditTrail(
      "User Registration",
      JSON.stringify({ email: newUser.email, username: newUser.username }),
      newUser._id
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

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
    // Validate required fields
    if (!email || !password) {
      logEvent("❌ LOGIN_FAIL", `Missing email or password`);
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      logEvent("❌ LOGIN_FAIL", `Invalid email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logEvent("❌ LOGIN_FAIL", `Wrong password for: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    logEvent("✅ LOGIN_SUCCESS", `${user.email}`);
    await logAuditTrail(
      "User Login",
      JSON.stringify({ email: user.email }),
      user._id
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

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
