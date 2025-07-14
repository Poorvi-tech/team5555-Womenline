const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = require('./config/db.js');
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('WomenLine backend is running');
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});