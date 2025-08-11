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

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      next(); // Proceed to next middleware/route
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
};

// Middleware to check user role(s) (RBAC)
const rolecheck = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.role) {
      return res.status(403).json({ message: "Access Denied: no role assigned" });
    }

    // Allow if user role is in allowedRoles array
    if (allowedRoles.includes(req.role)) {
      return next();
    }

    return res.status(403).json({ message: "Access Denied: only admin can access" });
  };
};

module.exports = {
  protect,
  rolecheck,
};
