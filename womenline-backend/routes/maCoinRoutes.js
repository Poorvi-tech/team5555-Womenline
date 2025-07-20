const express = require("express");
const router = express.Router();
const { earnCredits } = require("../controllers/maCoinController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/earn-credits", authMiddleware, earnCredits);

module.exports = router;
