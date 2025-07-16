exports.successResponse = (message, data) => ({
  success: true,
  message,
  data
});

exports.errorResponse = (message, error = null) => ({
  success: false,
  message,
  error
});
