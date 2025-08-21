# WhatsApp Integration – WomenLine Backend

This document outlines the integration steps for sending WhatsApp messages via Twilio in the WomenLine backend project.

---

## ✅ Objective

Allow authenticated users to send WhatsApp notifications from the system using Twilio's WhatsApp Business API.
Enable system to handle inbound WhatsApp messages and send auto-replies.
Support weekly checklist broadcast to all registered users

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
DB Logs	models/whatsAppLog.js

5. Route Protection
*File: routes/whatsappRoutes.js
*Middleware:
  *protect (JWT authentication).
  *rateLimiter (prevent abuse).
*Route: POST /api/whatsapp/send-whatsapp

✅ Sample Request(Outbound)
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

6. Inbound WhatsApp Handler
File: routes/whatsappTestRoute.js
Route: POST /api/whatsapp/inbound
Triggered when a user sends a WhatsApp message to our Twilio number.
Extracts From and Body from incoming request.
Sends auto-reply:

💜 Thank you for messaging WomenLine!
This WhatsApp number is only for sending important updates and reminders.
For help or support, please use our app or website.

Sample Request (Twilio Webhook):

POST /api/whatsapp/inbound
Content-Type: application/x-www-form-urlencoded
From=whatsapp:+919876543210&Body=hello

7. Weekly Checklist Broadcast
File: routes/whatsappTestRoute.js
Route: GET /api/whatsapp/test-weekly-checklist
Fetches all users with a phone number.
Sends them a Doctor Weekly Checklist message:

🩺 Weekly Doctor Checklist
✅ Drink water
✅ Eat healthy
✅ Take medicines
✅ Sleep well
✅ Exercise
✅ Manage stress
- WomenLine

Sample Request:
GET /api/whatsapp/test-weekly-checklist

8. Routes Summary
| Method | Endpoint                              | Description                         | Auth  |
| ------ | ------------------------------------- | ----------------------------------- | ----- |
| POST   | `/api/whatsapp/send-whatsapp`         | Send WhatsApp to given phone        | ✅ JWT |
| POST   | `/api/whatsapp/inbound`               | Handle inbound user message + reply | ❌ No  |
| GET    | `/api/whatsapp/test-weekly-checklist` | Broadcast weekly checklist to users | ❌ No  |

## Inbound WhatsApp Auto-Reply
Webhook Endpoint:
POST /api/whatsapp/inbound
Twilio will send a POST request to this endpoint whenever a user sends a message to your WhatsApp number.
Local Testing vs Production:
Local development: You need a tool like ngrok
 to expose your localhost. For example:
https://<random-ngrok-id>.ngrok.io/api/whatsapp/inbound
You then configure this URL in the Twilio Sandbox as the “WHEN A MESSAGE COMES IN” webhook.

Production (Render/Vercel/other): Your deployed app already has a public URL. You can set:
https://womenline-backend.onrender.com/api/whatsapp/inbound
in Twilio as the inbound webhook.
Twilio Sandbox Setup:
Go to your Twilio Console → Programmable Messaging → WhatsApp Sandbox
Set WHEN A MESSAGE COMES IN to your webhook URL.
Twilio will now forward all inbound messages to your /inbound endpoint.
Handling Messages:
Your whatsappTestRoute.js already extracts the sender and message body:
let from = req.body.From;
let incomingMsg = req.body.Body;
Then it sends an auto-reply back via sendWhatsAppMessage(from, reply).

✅ Key Takeaways
Yes, you must provide a URL to Twilio (ngrok for dev, Render URL for production).
Twilio calls this URL whenever a user messages your WhatsApp number.
Your existing /inbound route handles these messages and sends an auto-reply.
```
