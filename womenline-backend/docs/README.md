🌸 WomenLine – AI-Powered Wellness & Safety Platform for Women
WomenLine is a comprehensive wellness platform designed to empower women by managing their health, safety, and emotional wellbeing. Core features include menstrual tracking, voice mood journals, green credit rewards, PDF health summaries, and WhatsApp alerts — all enhanced with multilingual and gamified experiences.

🌐 Deployment Links
Service URL
Backend (Render) [https://team5555-womenline-final.onrender.com]
GitHub Repo [https://github.com/Poorvi-tech/team5555-Womenline.git]

⚙️ Tech Stack
Layer Technologies
Backend Node.js, Express.js
Database MongoDB (Atlas)
Testing Mocha, Chai, Chai-HTTP
Uploads Multer
Logging Custom File Logger (Winston)
Messaging Twilio WhatsApp API, Nodemailer
Reports PDFKit
Background Jobs Node Cron (Weekly Checklist Job)

📦 Installation Guide

# 1. Clone the repository

git clone https://github.com/Poorvi-tech/team5555-Womenline.git
cd womenline-backend

# 2. Install dependencies

npm install

# 3. Setup environment variables

cp .env.example .env

# Edit `.env` file with actual credentials (MongoDB URI, JWT Secret, Twilio creds, Email creds)

# 4. Start development server

npm start

# 5. Run tests individually

⚠️ Important: Running npm test directly may cause errors due to simultaneous database connections. Please run test files one by one.
npx mocha "test/journal.test.js" --timeout 30000 --exit
npx mocha "test/maCoin.test.js" --timeout 30000 --exit
npx mocha "test/pdf.test.js" --timeout 30000 --exit
npx mocha "test/period.test.js" --timeout 30000 --exit
npx mocha "test/reward.test.js" --timeout 30000 --exit
npx mocha "test/voice.test.js" --timeout 30000 --exit
npx mocha "test/whatsapp.test.js" --timeout 30000 --exit
npx mocha "test/checklist.test.js" --timeout 30000 --exit
npx mocha "test/forum.test.js" --timeout 30000 --exit
npx mocha "test/abuse.test.js" --timeout 30000 --exit
npx mocha "test/auth.test.js" --timeout 30000 --exit
npx mocha "test/appointments.test.js" --timeout 30000 --exit

🛠️ Environment Variables (.env)
Key Description
MONGODB_URI MongoDB Atlas Connection String
JWT_SECRET JWT Secret Key
SESSION_SECRET Session Secret Key
PORT Backend Port (default: 5000)
TWILIO_ACCOUNT_SID Twilio Account SID
TWILIO_AUTH_TOKEN Twilio Auth Token
TWILIO_WHATSAPP_FROM Twilio WhatsApp Sender Number
EMAIL_USER Gmail ID for SMTP
EMAIL_PASS Gmail App Password for SMTP
NODE_ENV=development  /  NODE_ENV=production

📂 Project Folder Structure
womenline-backend/
├── controllers/        # API Controllers
├── models/             # MongoDB Schemas
├── routes/             # API Routes
├── middleware/         # Auth, Role checks, Error handler
├── utils/              # Logger, PDF Generator, WhatsApp Service, Credits Calculator
├── jobs/               # Background Jobs
│   └── weeklyChecklistJob.js
├── data/               # Static Data
│   └── reward.json
├── logs/               # Logs
│   ├── app.log
│   ├── error.log
│   └── security.log
├── uploads/            # Uploaded Files (voice, pdf)
├── test/               # Mocha-Chai Test Cases
├── app.js              # Main App Entry
└── .env.example

🧪 Testing Overview
All modules have 100% Mocha-Chai test coverage:
Authentication ✅
Journals ✅
Period Tracker ✅
Rewards ✅
Leaderboard ✅
WhatsApp ✅
PDF Export ✅
File Upload ✅
Abuse Reporting ✅
Forum Posts & Replies ✅
Appointment Booking ✅
Doctor Checklist ✅

Run All Tests:
npm test

🔐 Security Audit Logging
All critical user activities are logged in logs/security.log:
User Registrations & Logins
Journal Entries Creation
Period Logs Submission
Rewards Redemption Actions
File Upload Activities
Abuse Reports & Sensitive Data Submissions
Appointment Bookings & Cancellations
Forum Replies
WhatsApp Alerts

📚 API Endpoints Summary
Authentication
POST /api/auth/register — Register a new user
POST /api/auth/login — Login & receive JWT
POST /api/auth/forgot-password - forgot password
POST /api/auth/reset-password - reset password 
POST /api/auth/send-otp — Send OTP for verification
POST /api/auth/verify-otp — Verify OTP for authentication
GET /api/auth/token-check — Check valid token

Journal (Voice Mood Tracking)
GET /api/journals — Fetch user journals
POST /api/journals — Create a journal entry

Period Tracker
POST /api/period-log — Log period entry
GET /api/period-log/:userId — Fetch period logs for a user

Green Credits & Rewards
POST /api/earn-credits — Earn credits (MaCoin)
POST /api/rewards/redeem — Redeem rewards
GET /api/rewards — Fetch available rewards
GET /api/rewards/user-credits — Fetch user's current credits
GET /api/rewards/user/redemption-history — Fetch user's redemption history

Leaderboard
GET /api/leaderboard — Fetch leaderboard (MaCoin/Posts)

PDF Reports
GET /api/pdf/export-summary — Export user summary PDF

WhatsApp Integration
POST /api/whatsapp/send-whatsapp – Send message via bot
POST /api/whatsapp/inbound – Twilio inbound webhook (auto replies)
GET /api/whatsapp/test-weekly-checklist – Test weekly broadcast

File Uploads
POST /api/upload/file — Upload files
GET /uploads/pdf/:filename — Access uploaded PDF files
POST /api/voice/upload — Upload voice entry
GET /uploads/voice/:filename — Access uploaded voice files

Abuse Reporting
POST /api/abuse/report-abuse — Report abuse
GET /api/abuse/report-abuse — Get abuse reports (Admin)

Forum
POST /api/forum/forum-post — Create forum post
POST /api/forum/forum-reply/:postId — Reply to forum post
GET /api/forum/forum-replies/:postId — Fetch replies for a post
POST /api/forum/report-post/:postId — Report a forum post
GET /api/forum/reports — See all forum reports (Admin only)

Appointment Booking
POST /api/appointments — Book an appointment
GET /api/appointments — Get user's appointments
DELETE /api/appointments/:id — Cancel an appointment

Doctor Checklist
GET /api/doctor-checklist — Fetch doctor checklist
POST /api/checklist — Add new doctor/checklist (Admin Only)
PUT /api/checklist/:id — Update doctor/checklist (Admin Only)
DELETE /api/checklist/:id — Delete doctor/checklist (Admin Only)

Utility & Health Check
GET /health — Check server status (Render deployment)
GET /error-test — Test error handling (Localhost)
GET /test-success — Test success response (Localhost)

📊 Logging
app.log – General logs
error.log – Error logs
security.log – Audit trail (login, rewards, abuse reports, etc.)

### Seeding Rewards
To initialize rewards collection (run only once in production if empty):
```bash
npm run seed:rewards


📤 Postman Collection
Download and import the API collection into Postman for quick testing:
Download womenline.postman_collection.json

✅ Completed Features
Role-based Auth + JWT
Voice Journals (with uploads)
Period & Mood Tracking
Rewards & Green Credit System
WhatsApp Alerts + Weekly Checklist
Abuse Reporting & Forum Module
Appointment Booking System
PDF Export (health summary)
Audit Logging (security.log, app.log, error.log)
Full Test Coverage (Mocha + Chai)
Render Deployment + GitHub CI/CD

📅 Backend Milestones
Week Deliverables
Week 1 Backend Setup, MongoDB Schemas, Auth APIs, Journal Base, Deploy to Render
Week 2 Period Tracker, Rewards, Green Credit Logic, API Testing, Protected Routes
Week 3 Abuse Reports, Forum Posts, PDF Export, WhatsApp Alerts, Final Test & QA
Week 4 Appointment Booking, Forum Replies, Doctor Checklist, Final Documentation, Full API Testing, Email OTP Integration
Week 5 Community Forum, Rewards Tracking, Security Audits, Automated Testing, Audit Trail
Week 6 Database & Models Finalization, API Testing, Secure Deployment & Integration

👥 Contributors
Team 5555 – Backend Team
