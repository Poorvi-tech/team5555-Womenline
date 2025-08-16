function errorResponse(message, error = null) {
  return {
    success: false,
    message,
    error,
  };
}

function successResponse(message, data = {}) {
  return {
    success: true,
    message,
    data,
  };
}

module.exports = { successResponse, errorResponse };
