const express = require("express");
const router = express.Router();
const { earnCredits } = require("../controllers/maCoinController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/earn-credits", authMiddleware.protect, earnCredits);

module.exports = router;
