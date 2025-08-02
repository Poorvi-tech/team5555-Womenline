const jwt = require("jsonwebtoken");
const logEvent = require("../utils/logger");

// Controller to handle access token refresh using refreshToken from cookies
exports.refertoken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    logEvent("TOKEN_REFRESH_MISSING", `No refresh token provided`);
    return res.status(401).json({ message: "No refresh token provided" });
  }

  // Verify refresh token validity
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      logEvent("TOKEN_REFRESH_FAIL", `Invalid refresh token`);
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token (expires in 1 hour)
    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    logEvent("TOKEN_REFRESHED", `Access token refreshed`, user.id);
    res.json({ accessToken: newAccessToken });
  });
};
