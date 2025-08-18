// Returns a standardized error response
function errorResponse(message, error = null) {
  return {
    success: false,
    message,
    error,
  };
}

// Returns a standardized success response
function successResponse(message, data = {}) {
  return {
    success: true,
    message,
    data,
  };
}

module.exports = { successResponse, errorResponse };
