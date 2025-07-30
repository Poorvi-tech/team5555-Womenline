#  WomenLine – An AI-Powered Wellness & Safety Platform for Women

**WomenLine** is an AI-powered wellness platform empowering women to manage their health, safety, and emotional wellbeing. It includes features like menstrual tracking, mood journals (with voice support), green credit rewards (MaCoins), PDF exports, WhatsApp alerts, and more – with multilingual and gamified support.

---

## 🌐 Hosted Links

- **Backend Render**: https://<your-render-url>
- **GitHub Repo**: https://github.com/Poorvi-tech/team5555-Womenline.git

---

## ⚙️ Tech Stack

| Layer       | Tech Used            |
|-------------|----------------------|
| Backend     | Node.js, Express.js  |
| Database    | MongoDB (Atlas)      |
| Testing     | Mocha, Chai, Chai-HTTP |
| Uploads     | Multer               |
| Logging     | Custom file logger   |
| Messaging   | Twilio WhatsApp API  |
| Reports     | PDFKit               |

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
# then fill in your actual values in .env

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
Rewards     	✅ Completed
MaCoins	        ✅ Completed
WhatsApp	    ✅ Completed
PDF Export   	✅ Completed
File Upload 	✅ Completed

Run tests using:
npm test

🔐 Security Audit Logging
All critical user events are logged into logs/security.log, including:
User Registration/Login
Journal Entry Creation
Period Log Creation
Rewards Earned & Redeemed
Credit Fetching
File Uploads

This log helps monitor misuse and access patterns.

📚 API Endpoints Summary :

✅ Authentication
POST /api/auth/register – Register a user
POST /api/auth/login – Login user and receive JWT

📝 Journal (with voice support)
POST /api/journals – Create journal (mood, note, voiceNote)
GET /api/journals – Get all journals for logged-in user

📅 Period Tracker
POST /api/period/log – Log new period entry
GET /api/period/:userId – Get user’s period logs

🏆 Rewards & MaCoins
POST /api/rewards/earn-credits – Earn green credits
GET /api/rewards – Get all rewards
POST /api/rewards/redeem – Redeem reward
GET /api/rewards/user-credits – Get current balance

📎 File Upload
POST /api/voice/upload – voice notes

📄 PDF Reports
GET /api/pdf/sample – Sample report PDF
GET /api/pdf/export-summary – Export journal logs as PDF

💬 WhatsApp Integration
POST /api/whatsapp/send-whatsapp – Send WhatsApp alert

🔄 Seeder (Rewards)
To seed default rewards:
npm run seed:rewards

Postman Collection :
You can download and import the complete API collection into Postman:
[Download womenline-api-collection.json](./docs/womenline-api-collection.json)

✅ Completed Features (per feedback)
 Voice-based journal
 File upload with auth + role protection
 Secure audit logging
 Period and mood tracking
 Green Credit earning logic
 Reward redemption
 WhatsApp integration via Twilio
 PDF generation from logs
 Automated testing (Mocha + Chai)