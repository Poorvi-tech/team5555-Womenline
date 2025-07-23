// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const { PeriodLog, Rewards, Journal } = require('../models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/period-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Period Tracker API');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});