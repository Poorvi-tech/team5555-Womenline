const express = require("express");
const router = express.Router();

const { earnCredits } = require("../controllers/maCoinController");
const { protect } = require("../middleware/authMiddleware");
const abusePrevention = require("../middleware/abusePrevention"); // New middleware

router.post("/earn-credits", protect, abusePrevention, earnCredits);

module.exports = router;