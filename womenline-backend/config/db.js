const mongoose = require("mongoose");

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    // Disable strict query mode for backward compatibility
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Database connected: ${conn.connection.host}`);
  } catch (error) {
    // Log error and exit process if connection fails
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
