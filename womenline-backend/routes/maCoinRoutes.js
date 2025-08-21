// maCoinRoutes.js
const express = require("express");
const router = express.Router();
const { earnCredits } = require("../controllers/maCoinController");
const { protect } = require("../middleware/authMiddleware");
const dailyCoinLimit = require("../middleware/dailyCoinLimit");

// Earn credits
router.post("/earn-credits", protect, dailyCoinLimit, earnCredits);

module.exports = router;
