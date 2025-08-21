const mongoose = require('mongoose');
require('dotenv').config();
const Reward = require('../models/Reward');
const rewards = require('../data/rewards.json'); 

async function seedRewards() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Reward.deleteMany(); // optional: clear old data
    const inserted = await Reward.insertMany(rewards);
    console.log(`✅ Rewards seeded: ${inserted.length}`);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error seeding rewards:", error.message);
    mongoose.disconnect();
  }
}

seedRewards();
