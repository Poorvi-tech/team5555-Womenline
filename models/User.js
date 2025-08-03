const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Username must be unique
    },

    email: {
      type: String,
      required: true,
      unique: true, // Email must be unique
    },

    password: {
      type: String,
      required: true, // Plain password (hashed before save)
    },

    role: {
      type: String,
      enum: ["admin", "user", "mother", "caregiver"], // User roles
      default: "user",
    },

    greenCredits: {
      type: Number,
      default: 0, // User's earned green credits
    },
  },
  { timestamps: true }
);

// Hash password before saving user to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password not modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
