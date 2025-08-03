// Middleware to ensure user consent for sensitive actions
const consentCheck = (req, res, next) => {
  // Check if 'consent' is provided and explicitly true
  if (!req.body.consent || req.body.consent !== true) {
    return res.status(400).json({
      success: false,
      message:
        "Consent is required to submit sensitive data like abuse reports or audio logs.",
    });
  }

  next(); // Consent given, proceed to next middleware/route
};

module.exports = { consentCheck };
