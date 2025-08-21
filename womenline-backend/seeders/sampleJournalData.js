const mongoose = require("mongoose");
require("dotenv").config();
const Journal = require("../models/Journal");
const fs = require("fs");
const path = require("path");

// ✅ Safeguard: Production me run nahi hoga
if (process.env.NODE_ENV === "production") {
  console.log("🚫 Production environment detected. Sample data seeding skipped.");
  process.exit();
}

// Load dummy data from JSON
const sampleDataPath = path.join(__dirname, "..", "data", "sampleJournalData.json");
let sampleData = [];

if (fs.existsSync(sampleDataPath)) {
  sampleData = JSON.parse(fs.readFileSync(sampleDataPath, "utf-8"));
} else {
  console.log("❌ sampleJournalData.json file not found!");
  process.exit(1);
}

async function seedJournal() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing journals for testing user only
    const testUserIds = sampleData.map((d) => d.userId);
    await Journal.deleteMany({ userId: { $in: testUserIds } });

    // Insert sample data
    const inserted = await Journal.insertMany(sampleData);
    console.log(`✅ ${inserted.length} journal entries seeded.`);

    // Disconnect from DB
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    mongoose.disconnect();
  }
}

// Run seeding
seedJournal();
