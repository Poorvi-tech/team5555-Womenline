const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = require('./config/db.js');
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const journalRoutes = require('./routes/journalRoutes');
app.use('/api/journals', journalRoutes);

app.get('/', (req, res) => {
  res.send('WomenLine backend is running');
});


//  Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});