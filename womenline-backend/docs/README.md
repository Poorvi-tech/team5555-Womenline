# 🌸 WomenLine – An AI-Powered Wellness & Safety Platform for Women

**WomenLine** is an AI-powered wellness platform empowering women to manage their **health, safety, and emotional wellbeing**. It offers features like **menstrual tracking**, **voice mood journals**, **green credit rewards**, **PDF health summaries**, and **WhatsApp alerts**, all with **multilingual** and **gamified** support.

---

## 🌐 Hosted Links

- **Backend Render**: https://<your-render-url>
- **GitHub Repo**: https://github.com/Poorvi-tech/team5555-Womenline.git

---

## ⚙️ Tech Stack

| Layer       | Tech Used               |
|-------------|-------------------------|
| Backend     | Node.js, Express.js     |
| Database    | MongoDB (Atlas)         |
| Testing     | Mocha, Chai, Chai-HTTP  |
| Uploads     | Multer                  |
| Logging     | Custom file logger      |
| Messaging   | Twilio WhatsApp API     |
| Reports     | PDFKit                  |

---

## 📦 Installation & Run Instructions

```bash
# 1. Clone the project
git clone https://github.com/Poorvi-tech/team5555-Womenline.git
cd womenline-backend
# 2. Install dependencies
npm install
# 3. Setup environment variables
cp .env.example .env
# Then fill in your actual values in the .env file
# 4. Start the backend server
npm start
# 5. Run tests
npm test


Environment Variables (.env.example)
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number


📁 Folder Structure
womenline-backend/
├── controllers/         # Business logic
├── models/              # Mongoose schemas
├── routes/              # API routes
├── middleware/          # Auth, upload, role guards
├── utils/               # Logger, credit calc, PDF tools
├── uploads/             # Uploaded files (voice, docs)
│   └── voice/
├── logs/                # Security logs
│   └── security.log
├── seeders/             # Seeder scripts
├── test/                # Mocha + Chai tests
├── test-data.js         # Dummy data for development
├── app.js               # Main server entry point
└── .env.example         # Sample env config


🧪 Testing Status
Module       	Test Status
Auth	        ✅ Completed
Journal	        ✅ Completed
Period Tracker	✅ Completed
Rewards	        ✅ Completed
MaCoins	        ✅ Completed
WhatsApp	    ✅ Completed
PDF Export	    ✅ Completed
File Upload     ✅ Completed
Abuse/Forum	    ✅ Completed

Run tests using:
npm test

🔐 Security Audit Logging
All critical events are logged in logs/security.log:
User login/register
Journal creation
Period log submission
Rewards redemption
File uploads
Helps track abuse, unauthorized access, and behavioral monitoring.

📚 API Endpoints Summary :
Authentication
POST /api/auth/register – Register a user
POST /api/auth/login – Login and receive JWT

Journal (Voice-Enabled)
POST /api/journals – Create journal (mood, note, voice)
GET /api/journals – Get all journals for user

Period Tracker
POST /api/period/log – Log new period entry
GET /api/period/:userId – Get user’s period logs

Green Credits + Rewards
POST /api/rewards/earn-credits – Earn credits
GET /api/rewards – Get available rewards
POST /api/rewards/redeem – Redeem rewards
GET /api/rewards/user-credits – Current balance

File Upload
POST /api/voice/upload – Upload voice note

PDF Reports
GET /api/pdf/sample – Get static health summary
GET /api/pdf/export-summary – Export PDF from journal entries

Abuse Reporting
POST /api/abuse/report-abuse – Report abuse (anonymous allowed)
GET /api/abuse/report-abuse – Admin fetch abuse logs

Forum
POST /api/forum/forum-post – Post public or anonymous post

WhatsApp Integration
POST /api/whatsapp/send-whatsapp – Send alerts on WhatsApp

🔄 Seeder (Rewards)
To seed default rewards:
npm run seed:rewards

Postman Collection :
You can download and import the complete API collection into Postman:
[Download womenline-api-collection.json](./docs/womenline-api-collection.json)

completed Features (per feedback)
✅ Voice-based journaling with file upload
✅ Auth + file role protection
✅ Green Credit system with redeem flow
✅ Period + Mood tracking
✅ PDF export (PDFKit)
✅ Twilio WhatsApp alerts
✅ Abuse reporting + forum base
✅ Mocha-Chai automated testing
✅ Secure audit logging
✅ Render deployment + GitHub CI

📌 Backend Team Milestones
✅ Week 1: Setup, schemas, auth, Git flow, journal base, Render deploy
✅ Week 2: Period tracker, rewards, credit logic, testing, protected APIs
✅ Week 3: Abuse reports, forum post, PDF export, WhatsApp prep