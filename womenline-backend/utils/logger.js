const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");

// Path to security log file
const logFilePath = path.join(__dirname, "..", "logs", "security.log");

// Ensure logs directory exists
const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Winston logger setup
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(), // logs to console
    new transports.File({ filename: path.join(logDir, "app.log") }), // all logs
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }), // only errors
  ],
});

// Log security events
function logEvent(eventType, message, userId = "anonymous") {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${eventType}] [User: ${userId}] ${message}\n`;

  // Write to security log file
  fs.appendFileSync(logFilePath, logMessage, "utf8");

  // Also log via winston
  logger.info(`${eventType} - User: ${userId} - ${message}`);
}

module.exports = logEvent;
