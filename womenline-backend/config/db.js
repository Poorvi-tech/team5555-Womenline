const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false); // Disable strict query mode
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;