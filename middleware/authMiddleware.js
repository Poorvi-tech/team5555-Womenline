const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes (auth required)
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    try {
      token = token.split(" ")[1]; // Extract token from "Bearer <token>"
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (without password) and role to request
      req.user = await User.findById(decoded.id).select("-password");
      req.role = decoded.role;

      next(); // Proceed to next middleware/route
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
};

// Middleware to check user role (RBAC)
const rolecheck = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.role)) {
      return next(); // Role matched, proceed
    }
    return res.status(403).json({ message: "Access Denied: role not matched" });
  };
};

module.exports = {
  protect,
  rolecheck,
};
