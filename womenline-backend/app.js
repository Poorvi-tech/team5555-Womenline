const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // MongoDB connection file

const app = express();

// ✅ Allowed CORS origins
const allowedOrigins = [
  'http://localhost:3000', // local frontend
  'https://yourfrontend.com' // live deployed frontend (replace this)
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
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Body parser
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const uploadRoutes = require('./routes/uploadRoutes');


app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/journals', journalRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('WomenLine backend is running');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
