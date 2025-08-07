# WhatsApp Integration – WomenLine Backend

This document outlines the integration steps for sending WhatsApp messages via Twilio in the WomenLine backend project.

---

## ✅ Objective

Enable users (authenticated) to send WhatsApp notifications from the system using Twilio's WhatsApp Business API.

---

## 🔧 Setup Instructions

### 1. Twilio Configuration

Add the following keys to your `.env` file:

```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=+14155238886

2. Utility Function
File: utils/sendWhatsApp.js
*Configures Twilio client
*Exports sendWhatsAppMessage(phone, message) to send WhatsApp messages

3. WhatsApp Controller
File: controllers/whatsappController.js
*Receives POST requests with { phone, message }
*Validates input
*Sends message using utility function
*Logs event using:
logEvent (internal security event logger)
logAuditTrail (for tamper-proof audit)
*Stores the sent message in MongoDB (WhatsAppLog)

4. Logging
Type	Location
Event Logs	utils/logger.js
Audit Logs	utils/logAuditTrail.js
Database Logs	models/whatsAppLog.js

5. Route Protection
*File: routes/whatsappRoutes.js
*Middleware: protect (JWT authentication), rateLimiter (prevent abuse)
*Route: POST /api/whatsapp/send-whatsapp

✅ Sample Request
POST /api/whatsapp/send-whatsapp
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
{
  "phone": "+9198XXXXXXXX",
  "message": "Welcome to WomenLine!"
}

✅ Result
*WhatsApp message sent
*Logs created (event, audit, database)
*Response: { success: true, message: "WhatsApp sent", sid: "<Twilio SID>" }