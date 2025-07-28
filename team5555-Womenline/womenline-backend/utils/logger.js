const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'logs', 'security.log');

// Ensure logs directory exists
const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

function logEvent(eventType, message, userId = 'anonymous') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${eventType}] [User: ${userId}] ${message}\n`;

  fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

module.exports = logEvent;
