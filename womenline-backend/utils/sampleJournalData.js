const mongoose = require("mongoose");
require("dotenv").config();
const Journal = require("../models/Journal.js");

// Sample journal entries to seed
const sampleData = [
  {
    userId: "687905303317650ba386d5be", // Sample user ObjectId
    mood: "Happy",
    note: "Feeling great today!",
    periodDay: "normal",
    date: "2025-07-01",
  },
  {
    userId: "687905303317650ba386d5be",
    mood: "Stressed",
    note: "A bit overwhelmed",
    periodDay: "light",
    date: "2025-07-02",
  },
];

// Seed sample journal data into database
async function seedJournal() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing journals
    await Journal.deleteMany();

    // Insert sample data
    const inserted = await Journal.insertMany(sampleData);
    console.log("✅ Journals seeded:", inserted.length);

    // Disconnect from DB
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    mongoose.disconnect();
  }
}
// Run the seeding function
seedJournal();
