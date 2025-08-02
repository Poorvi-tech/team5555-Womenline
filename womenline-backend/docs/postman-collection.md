🧪 WomenLine – API Collection (Postman Ready)
This collection outlines the WomenLine API Endpoints with structured details for testing & integration. Import into Postman or follow for manual testing.

🔑 AUTHENTICATION
➡️ Register User
Method: POST
Endpoint: /api/auth/register
Body (JSON):json
{
  "username": "Poorvi",
  "email": "poorvi@example.com",
  "password": "password123",
  "role": "user"
}
➡️ Login User
Method: POST
Endpoint: /api/auth/login
Body (JSON):json
{
  "email": "poorvi@example.com",
  "password": "password123"
}

📝 JOURNAL (Voice & Mood)
➡️ Create Journal Entry
Method: POST
Endpoint: /api/journals
Headers: Authorization: Bearer <token>
Body (JSON):json
{
  "mood": "Peaceful",
  "note": "Feeling relaxed",
  "periodDay": "3",
  "date": "2025-07-20",
  "voiceNote": "uploads/voice-abc123.mp3"
}
➡️ Fetch All Journals (User-specific)
Method: GET
Endpoint: /api/journals
Headers: Authorization: Bearer <token>

🩸 PERIOD TRACKER
➡️ Log New Period
Method: POST
Endpoint: /api/period-log
Body (JSON):json
{
  "userId": "USER_ID",
  "startDate": "2025-07-15",
  "endDate": "2025-07-20",
  "symptoms": ["cramps", "bloating"],
  "mood": "Stressed",
  "notes": "Mild pain",
  "cycleLength": 28
}
➡️ Get User’s Period Logs
Method: GET
Endpoint: /api/period-log/:userId
Headers: Authorization: Bearer <token>

🪙 GREEN CREDITS & REWARDS
➡️ Earn Credits (Activity-Based)
Method: POST
Endpoint: /api/rewards/earn-credits
Body (JSON):json
{
  "userId": "USER_ID",
  "activityType": "journal-entry",
  "source": "journal"
}
➡️ Get User’s Current Credits
Method: GET
Endpoint: /api/rewards/user-credits
Headers: Authorization: Bearer <token>
➡️ Redeem Reward
Method: POST
Endpoint: /api/rewards/redeem
Headers: Authorization: Bearer <token>
Body (JSON):json
{
  "rewardId": "REWARD_ID",
  "cost": 10
}
➡️ Get Available Rewards
Method: GET
Endpoint: /api/rewards

📄 PDF EXPORT
➡️ Download Sample Health PDF
Method: GET
Endpoint: /api/pdf/sample
➡️ Export Journal Summary PDF
Method: GET
Endpoint: /api/pdf/export-summary
Headers: Authorization: Bearer <token>

📞 WHATSAPP ALERTS
➡️ Send WhatsApp Message
Method: POST
Endpoint: /api/whatsapp/send-whatsapp
Body (JSON):json
{
  "phone": "+91xxxxxxxxxx",
  "message": "Your Green credits summary"
}
Headers: Authorization: Bearer <token>

📤 FILE UPLOADS
➡️ Upload General File (PDF/Image)
Method: POST
Endpoint: /api/upload/file
Headers: Authorization: Bearer <token>
Body (Form-Data):
file: (Choose any .jpg, .png, .pdf)
➡️ Upload Voice Note
Method: POST
Endpoint: /api/voice/upload
Headers: Authorization: Bearer <token>
Body (Form-Data):
voiceFile: (Select .mp3 / .wav)

🚨 ABUSE REPORTING (Protected)
➡️ Report Abuse
Method: POST
Endpoint: /api/abuse/report-abuse
Headers: Authorization: Bearer <token>
Body (JSON):json
{
  "type": "verbal",
  "description": "Someone shouted in hospital",
  "location": "Ward 3",
  "consent": true
}
➡️ View All Abuse Reports (Admin Only)
Method: GET
Endpoint: /api/abuse/report-abuse
Headers: Authorization: Bearer <admin-token>

💬 FORUM POSTS (Anonymous Allowed)
➡️ Post Forum Entry
Method: POST
Endpoint: /api/forum/forum-post
Body (JSON):json
{
  "title": "Need support",
  "content": "I feel very alone",
  "postedBy": "anonymous"
}

🔒 Token Requirement (Protected Routes)
All routes except register, login, sample PDF require:
Headers:Authorization: Bearer <JWT_TOKEN>

📥 Postman Collection Import Instructions
Open Postman > Workspace.
Click Import > Raw Text.
Paste this structure or use exported .json (Optional).
Fill Authorization Headers with JWT Token after login.

📤 Export Postman Collection as JSON
You can also export the live collection using:
npm install -g postman-to-openapi
postman-to-openapi womenline.postman_collection.json --output womenline-openapi.yaml
