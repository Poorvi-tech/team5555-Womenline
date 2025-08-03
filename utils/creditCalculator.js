// Utility function to calculate credits based on activity type
function calculateCredits(activityType) {
  // Mapping of activity types to corresponding credit values
  const creditMap = {
    "daily-login": 5,
    "journal-entry": 10,
    "period-log": 15,
    meditation: 20,
    exercise: 25,
  };

  // Return the mapped credits or 0 if activityType not found
  return creditMap[activityType] || 0;
}

module.exports = calculateCredits;
