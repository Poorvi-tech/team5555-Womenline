const consentCheck = (req, res, next) => {
  if (!req.body.consent || req.body.consent !== true) {
    return res.status(400).json({
      success: false,
      message: 'Consent is required to submit sensitive data like abuse reports or audio logs.'
    });
  }
  next(); 
};

module.exports = { consentCheck };
