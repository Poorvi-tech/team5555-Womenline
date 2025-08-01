# 🧪 WomenLine – API Collection (Postman Style)

Below is the structured format of your REST APIs for WomenLine project. You can import these into Postman or test manually using the routes.

## AUTH

### 🔹 Register

- URL: /api/auth/register
- Method: POST
- Body:json
  {
  "username": "Poorvi",
  "email": "poorvi@example.com",
  "password": "password123",
  "role": "user"
  }

🔹 Login
URL: /api/auth/login
Method: POST
Body:json
{
"email": "poorvi@example.com",
"password": "password123"
}

JOURNAL
🔹 Create Journal Entry
URL: /api/journals
Method: POST
Headers: Authorization: Bearer <token>
Body:json
{
"mood": "Peaceful",
"note": "Feeling relaxed",
"periodDay": "3",
"date": "2025-07-20",
"voiceNote": "uploads/voice-abc123.mp3"
}

🔹 Fetch All Journals
URL: /api/journals
Method: GET
Headers: Authorization: Bearer <token>

🩸 PERIOD
🔹 Log Period
URL: /api/period-log
Method: POST
Body:json
{
"userId": "USER_ID",
"startDate": "2025-07-15",
"endDate": "2025-07-20",
"symptoms": ["cramps", "bloating"],
"mood": "Stressed",
"notes": "Mild pain",
"cycleLength": 28
}

🔹 Get Period Logs
URL: /api/period/:userId
Method: GET

🪙 MACOINS / REWARDS
🔹 Earn Credits (General)
URL: /api/rewards/earn-credits
Method: POST
Body:json
{
"userId": "USER_ID",
"activityType": "plant_tree",
"source": "journal"
}

🔹 Get User Credits
URL: /api/rewards/user-credits

Method: GET
Headers: Authorization: Bearer <token>

🔹 Redeem Reward
URL: /api/rewards/redeem
Method: POST
Headers: Authorization: Bearer <token>
Body:json
{
"rewardId": "REWARD_ID",
"cost": 10
}

🔹 Get Available Rewards
URL: /api/rewards
Method: GET

📤 PDF EXPORT
🔹 Download Sample PDF
URL: /api/pdf/sample
Method: GET

🔹 Export Summary from Journal
URL: /api/pdf/export-summary
Method: GET

# WHATSAPP

🔹 Send Message
URL: /api/whatsapp/send-whatsapp
Method: POST
Body:json
{
"phone": "+91xxxxxxxxxx",
"message": "Your Green credits summary"
}

FILE UPLOAD
🔹 Upload File (PDF, Image, etc.)
URL: /api/upload/file
Method: POST
Headers: Authorization: Bearer <token>
Body (Form Data):file: (Choose any .jpg, .png, .pdf file)

🎙️ Voice Note Upload
🔹 Upload Voice File (MP3, WAV)
URL: /api/voice/upload
Method: POST
Headers:
Authorization: Bearer <token>
Body: (Form-data)
voice: (Choose your .mp3, .wav, or audio file)
Success Response:
{
"success": true,
"message": "Voice file uploaded successfully",
"filePath": "uploads/voice-xyz123.mp3"
}

🚨 Abuse Reporting (Protected Now)
🔹 Report Abuse
URL: /api/abuse/report-abuse
Method: POST
Headers:
Authorization: Bearer <token>
Body :json
{
  "type": "verbal",
  "description": "Someone shouted in hospital",
  "location": "Ward 3",
  "consent": true
}

🔹 View Abuse Reports (Admin)
URL: /api/abuse/report-abuse
Method: GET
Headers: Authorization: Bearer <admin-token>

💬 Forum Post (Anonymous Allowed)
🔹 Create Forum Post
URL: /api/forum/forum-post
Method: POST
Body :json
{
  "title": "Need support",
  "content": "I feel very alone",
  "postedBy": "anonymous"
}


TOKEN REQUIRED (Protected Routes)
These routes require Authorization header:
Authorization: Bearer <JWT_TOKEN>
Postman Export
You can manually recreate this in Postman or export using npm install postman-to-openapi.
