// middleware/errorHandler.js
const logEvent = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Audit log me bhi error save karo
  logEvent("ERROR", {
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    user: req.user ? req.user.id : "Guest",
  });

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};

module.exports = errorHandler;
