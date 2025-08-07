const express = require("express");
const router = express.Router();
const { triggerWhatsApp } = require("../controllers/whatsappController");
const { protect } = require("../middleware/authMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

//  Keep only this route for sending WhatsApp messages
router.post("/send-whatsapp", protect, rateLimiter, triggerWhatsApp);

module.exports = router;