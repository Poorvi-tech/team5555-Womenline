const mongoose = require('mongoose');
require('dotenv').config();
const Reward = require('../models/Reward');

const rewards = [
  {
    title: "Free Health Checkup",
    description: "One-time free checkup at partnered clinics.",
    cost: 100,
    category: "Health"
  },
  {
    title: "Mental Wellness Session",
    description: "Free therapy session with a certified professional.",
    cost: 80,
    category: "Mental"
  },
  {
    title: "Nutritional Supplement Kit",
    description: "Includes vitamins and iron supplements.",
    cost: 120,
    category: "Supplements"
  },
  {
    title: "Yoga Workshop Pass",
    description: "Access to a 3-day online yoga class.",
    cost: 60,
    category: "Health"
  },
  {
    title: "Motivational eBook",
    description: "Downloadable eBook to boost confidence.",
    cost: 30,
    category: "Mental"
  }
];

async function seedRewards() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Reward.deleteMany(); // optional: clear old data
    const inserted = await Reward.insertMany(rewards);
    console.log("✅ Rewards seeded:", inserted.length);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error seeding rewards:", error.message);
    mongoose.disconnect();
  }
}

seedRewards();
