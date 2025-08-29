const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: { 
  type: String, 
  required: true,
  validate: {
    validator: function(v) {
      // E.164 format check e.g. +919876543210
      return /^\+[1-9]\d{1,14}$/.test(v);
    },
    message: props => `${props.value} is not a valid phone number!`
  }
},
    role: {
      type: String,
      enum: ["admin", "user", "mother", "caregiver"],
      default: "user",
    },
    greenCredits: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
  type: Boolean,
  default: false
},
    redemptionHistory: [{
      rewardId: { type: mongoose.Schema.Types.ObjectId, ref: "Reward" },
      redeemedAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
