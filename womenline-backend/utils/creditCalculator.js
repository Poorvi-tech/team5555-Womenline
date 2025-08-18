// Calculate credits earned based on activity type
function calculateCredits(activityType) {
  const creditMap = {
    "daily-login": 5,
    "journal-entry": 10,
    "period-log": 15,
    meditation: 20,
    exercise: 25,
  };

  return creditMap[activityType] || 0;
}

module.exports = calculateCredits;
