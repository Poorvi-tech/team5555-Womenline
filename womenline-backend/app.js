const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PeriodLog, Rewards, Journal } = require('./models');
const connectDB = require('./config/db'); // MongoDB connection file

const fs = require('fs');
const path = require('path');

// Ensure 'uploads' folder exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}


const app = express();

// ✅ Allowed CORS origins
const allowedOrigins = [
  'http://localhost:8000', // local frontend
  'https://yourfrontend.com' // live deployed frontend 
];

// ✅ Secure CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials:true
}));

// ✅ Body parser
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const rewardRoutes = require("./routes/rewardRoutes");
const maCoinRoutes = require("./routes/maCoinRoutes");
const pdfRoutes = require('./routes/pdfRoutes');
const periodRoutes = require('./routes/periodRoutes');

app.use('/api/pdf', pdfRoutes);
app.use("/api", maCoinRoutes);
app.use("/api/rewards", rewardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api', periodRoutes); // Period Tracker routes

// ✅ Test route
app.get('/', (req, res) => {
  res.send('WomenLine backend is running');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
