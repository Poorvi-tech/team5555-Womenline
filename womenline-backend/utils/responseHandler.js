// Utility to send standardized success response
exports.successResponse = (message, data) => ({
  success: true,
  message,
  data,
});

// Utility to send standardized error response
exports.errorResponse = (message, error = null) => ({
  success: false,
  message,
  error,
});
