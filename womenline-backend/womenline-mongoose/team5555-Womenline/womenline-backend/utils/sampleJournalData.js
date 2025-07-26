const mongoose = require('mongoose');
require('dotenv').config();
const Journal = require('../models/Journal.js');

const sampleData = [
  {
    userId: "687905303317650ba386d5be", // ✅ actual ObjectId
    mood: "Happy",
    note: "Feeling great today!",
    periodDay: "normal",
    date: "2025-07-01"
  },
  {
    userId: "687905303317650ba386d5be",
    mood: "Stressed",
    note: "A bit overwhelmed",
    periodDay: "light",
    date: "2025-07-02"
  }
];

async function seedJournal() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Journal.deleteMany();
    const inserted = await Journal.insertMany(sampleData);
    console.log("✅ Journals seeded:", inserted.length);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    mongoose.disconnect();
  }
}

seedJournal();
