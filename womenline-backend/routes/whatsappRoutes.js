const express = require("express");
const router = express.Router();
const { triggerWhatsApp } = require("../controllers/whatsappController");
const { protect } = require("../middleware/authMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

// Send WhatsApp message
router.post("/send-whatsapp", protect, rateLimiter, triggerWhatsApp);

module.exports = router;