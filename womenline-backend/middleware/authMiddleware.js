const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      req.role = decoded.role;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
};

const rolecheck = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.role)) {
      return next();
    }
    return res.status(403).json({ message: "Access Denied: role not matched" });
  };
};


module.exports = {
  protect,
  rolecheck
};
