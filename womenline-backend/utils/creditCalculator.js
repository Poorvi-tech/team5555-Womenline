const creditMap = require("../data/credits.json");

function calculateCredits(activityType) {
  return creditMap[activityType] || 0;
}

module.exports = calculateCredits;
