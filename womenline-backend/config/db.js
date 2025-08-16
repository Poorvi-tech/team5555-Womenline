/**
 * Database Connection Utility
 * ---------------------------------
 * This module establishes a connection to MongoDB
 * using Mongoose. It ensures that the application
 * exits gracefully if the connection fails.
 */

const mongoose = require("mongoose");

/**
 * Connects to MongoDB using Mongoose.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Logs successful connection or exits on failure.
 */
const connectDB = async () => {
  try {
    // Disable strict query mode for backward compatibility
    mongoose.set("strictQuery", false);

    // Establish MongoDB connection
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log host info on successful connection
    console.log(`✅ Database connected: ${conn.connection.host}`);
  } catch (error) {
    // Log error and exit process if connection fails
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
