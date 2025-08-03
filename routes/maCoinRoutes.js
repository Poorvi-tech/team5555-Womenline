const express = require("express");
const router = express.Router();

const { earnCredits } = require("../controllers/maCoinController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   POST /api/maCoin/earn-credits
// @desc    Earn Green Credits (maCoin) for user activities
// @access  Protected
router.post("/earn-credits", authMiddleware.protect, earnCredits);

module.exports = router;
