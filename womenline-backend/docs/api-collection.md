🧪 WomenLine – API Collection (Postman Ready)
This collection outlines the WomenLine API Endpoints with structured details for testing & integration. Import into Postman or follow for manual testing.

🔑 AUTHENTICATION
➡️ Register User
Method: POST
Endpoint: /api/auth/register
Body (JSON):
{
"username": "Poorvi",
"email": "poorvi@example.com",
"password": "password123",
}

➡️ Login User
Method: POST
Endpoint: /api/auth/login
Body (JSON):
{
"email": "poorvi@example.com",
"password": "password123"
}

➡️ Send OTP (Forgot Password)
Method: POST
Endpoint: /api/auth/send-otp
Body (JSON):
{
"email": "poorvi@example.com"
}

➡️ Verify OTP
Method: POST
Endpoint: /api/auth/verify-otp
Body (JSON):
{
"email": "poorvi@example.com",
"otp": "123456"
}

📝 JOURNAL (Voice & Mood)
➡️ Create Journal Entry
Method: POST
Endpoint: /api/journals
Headers: Authorization: Bearer <token>
Body (JSON):
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
Body (JSON):
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
Body (JSON):
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
Body (JSON):
{
"rewardId": "REWARD_ID",
"cost": 10
}

➡️ Get Available Rewards
Method: GET
Endpoint: /api/rewards

➡️ Get Redemption History 
GET /api/rewards/redemption-history
Headers: Authorization: Bearer <token>

📊 LEADERBOARD - Top 10 rank
➡️ Get Leaderboard Rankings
GET /api/leaderboard
Headers: Authorization: Bearer <token>

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
Body (JSON):
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
Body (Form-Data):file: (Choose any .jpg, .png, .pdf)

➡️ Upload Voice Note
Method: POST
Endpoint: /api/voice/upload
Headers: Authorization: Bearer <token>
Body (Form-Data):voiceFile: (Select .mp3 / .wav)

➡️ Test Voice Upload 
Method: GET
Endpoint: /uploads/voice/filename

➡️ Test PDF/Image Upload 
Method: GET
Endpoint: /uploads/pdf/filename

🚨 ABUSE REPORTING (Protected)
➡️ Report Abuse
Method: POST
Endpoint: /api/abuse/report-abuse
Headers: Authorization: Bearer <token>
Body (JSON):
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
Body (JSON):
{
"title": "Need support",
"content": "I feel very alone",
"postedBy": "anonymous"
}

➡️ Add Forum Reply
Method: POST
Endpoint: /api/forum-reply/:postId
Headers: Authorization: Bearer <token>
Body (JSON):
{
"reply": "You are not alone. Stay strong."
}

➡️ Get Forum Replies for a Post 
GET /api/forum/forum-replies/:postId
Headers: Authorization: Bearer <token>

➡️ Report Forum Post 
POST /api/forum/report-post
Headers: Authorization: Bearer <token>

{
  "postId": "POST_ID",
  "reason": "Spam content"
}

➡️ Get Forum Reports (Admin Only)
GET /api/forum/reports
Headers: Authorization: Bearer <admin-token>

📅 APPOINTMENT BOOKING
➡️ Book an Appointment
Method: POST
Endpoint: /api/appointments
Headers: Authorization: Bearer <token>
Body (JSON):
{
"doctorName": "Dr. Sharma",
"date": "2025-08-10",
"timeSlot": "10:00 AM - 10:30 AM"
}

➡️ Get User Appointments
Method: GET
Endpoint: /api/appointments
Headers: Authorization: Bearer <token>

➡️ Cancel an Appointment
Method: DELETE
Endpoint: /api/appointments/:id
Headers: Authorization: Bearer <token>

🩺 DOCTOR CHECKLIST
➡️ Get Doctor Checklist
Method: GET
Endpoint: /api/doctor-checklist
Headers: Authorization: Bearer <token>

➡️ Add Doctor Checklist Step  
Method: POST  
Endpoint: /api/doctor-checklist  
Headers: Authorization: Bearer <admin_token>  
Body (JSON):
{
"message": "Checklist step added successfully",
"checklist": {
"\_id": "user_id",
"step": "Get 8 hours of sleep",
"description": "Supports physical and mental recovery"
}
}

➡️ Check Token Validity
Method: GET
Endpoint: /api/auth/token-check
Headers:Authorization: Bearer <token>
Response:json
{
"valid": true,
"user": {
"id": "USER_ID",
"email": "poorvi@example.com",
"role": "user"
}
}

🟢 TEST ENDPOINTS
➡️ Health Check
Method: GET
Endpoint: /health

➡️ Error Test
Method: GET
Endpoint: /error-test

➡️ Test Success
Method: GET
Endpoint: /test-success

🔒 Token Requirement (Protected Routes)
All routes except register, login, sample PDF require:
Headers: Authorization: Bearer <JWT_TOKEN>

📥 Postman Collection Import Instructions
Open Postman > Workspace.
Click Import > Raw Text.
Paste this structure or use exported .json (Optional).
Fill Authorization Headers with JWT Token after login.

📤 Export Postman Collection as JSON
You can also export the live collection using:
npm install -g postman-to-openapi
postman-to-openapi womenline.postman_collection.json --output womenline-openapi.yaml
