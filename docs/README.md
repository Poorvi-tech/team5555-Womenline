🌸 WomenLine – AI-Powered Wellness & Safety Platform for Women
WomenLine is a comprehensive wellness platform designed to empower women by managing their health, safety, and emotional wellbeing. Core features include menstrual tracking, voice mood journals, green credit rewards, PDF health summaries, and WhatsApp alerts — all enhanced with multilingual and gamified experiences.

🌐 Deployment Links
Service URL
Backend (Render) https://your-render-url
GitHub Repo [https://github.com/Poorvi-tech/team5555-Womenline.git]

⚙️ Tech Stack
Layer Technologies
Backend Node.js, Express.js
Database MongoDB (Atlas)
Testing Mocha, Chai, Chai-HTTP
Uploads Multer
Logging Custom File Logger
Messaging Twilio WhatsApp API
Reports PDFKit

📦 Installation Guide
# 1. Clone the repository
git clone https://github.com/Poorvi-tech/team5555-Womenline.git
cd womenline-backend
# 2. Install dependencies
npm install
# 3. Setup environment variables
cp .env.example .env
# Edit `.env` file with actual credentials (MongoDB URI, JWT Secret, Twilio creds)
# 4. Start the development server
npm start
# 5. Run all tests
npm test

🛠️ Environment Variables (.env)
Key Description
MONGO_URI MongoDB Connection String
JWT_SECRET JWT Secret Key
TWILIO_ACCOUNT_SID Twilio Account SID
TWILIO_AUTH_TOKEN Twilio Auth Token
TWILIO_PHONE_NUMBER Twilio WhatsApp Phone Number

📂 Project Folder Structure
womenline-backend/
├── controllers/ # API Controllers (Business Logic)
├── models/ # Mongoose Schemas
├── routes/ # API Routes
├── middleware/ # Auth, Role Checks, Upload Middlewares
├── utils/ # Helpers: Logger, PDF Generator, Credit Calculator
├── uploads/ # Uploaded Files (voice, documents)
│ └── voice/
├── logs/ # Security Logs (audit events)
│ └── security.log
├── seeders/ # Database Seeder Scripts
├── test/ # Mocha-Chai API Tests
├── app.js # Main Entry Point of the Backend
└── .env.example # Example Environment Variables

🧪 Testing Overview
Module Test Status
Authentication      ✅ Completed
Journals            ✅ Completed
Period Tracker      ✅ Completed
Rewards             ✅ Completed
MaCoins             ✅ Completed
WhatsApp            ✅ Completed
PDF Export          ✅ Completed
File Upload         ✅ Completed
Abuse/Forum         ✅ Completed

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

📚 API Endpoints Summary
Authentication
Method Endpoint Description
POST /api/auth/register Register a new user
POST /api/auth/login Login & receive JWT

Journal (Voice Mood Tracking)
Method Endpoint Description
POST /api/journals Create journal entry
GET /api/journals Fetch all journals

Period Tracker
Method Endpoint Description
POST /api/period-log Log a new period entry
GET /api/period-log/:userId Get user's period logs

Green Credits & Rewards
Method Endpoint Description
POST /api/rewards/earn-credits Earn credits
GET /api/rewards Get available rewards
POST /api/rewards/redeem Redeem rewards
GET /api/rewards/user-credits Fetch user's credit balance

File Uploads
Method Endpoint Description
POST /api/voice/upload Upload voice note

PDF Reports
Method Endpoint Description
GET /api/pdf/sample Download sample PDF
GET /api/pdf/export-summary Export health summary PDF

Abuse Reporting & Forum
Method Endpoint Description
POST /api/abuse/report-abuse Submit abuse report
GET /api/abuse/report-abuse Admin fetch abuse reports
POST /api/forum/forum-post Post a public/anonymous forum post

WhatsApp Integration
Method Endpoint Description
POST /api/whatsapp/send-whatsapp Send WhatsApp Alert

🔄 Seeder (Dummy Data for Rewards)
Run the seeder script to populate initial reward data:
npm run seed:rewards

📤 Postman Collection
Download and import the API collection into Postman for quick testing:
Download womenline.postman_collection.json

✅ Completed Features
Voice-enabled Journals with file upload
Role-based API Protection (Auth + Rolecheck)
Green Credit System & Reward Redemption Flow
Period & Mood Tracking
PDF Health Summaries (PDFKit)
WhatsApp Alerts Integration (Twilio)
Abuse Reporting & Forum Posting Modules
Full Mocha-Chai API Test Coverage
Secure Audit Logging Mechanism
Render Deployment + GitHub Workflow CI/CD

📅 Backend Milestones
Week Deliverables
Week 1 Backend Setup, MongoDB Schemas, Auth APIs, Journal Base, Deploy to Render
Week 2 Period Tracker, Rewards, Green Credit Logic, API Testing, Protected Routes
Week 3 Abuse Reports, Forum Posts, PDF Export, WhatsApp Alerts, Final Test & QA

👥 Contributors
Team 5555 – Backend Team
