const User = require('../models/User');
const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is top-admin
    const user = await User.findById(decoded.user.id);
    if (!user || user.role !== 'top-admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only top-admin can perform this action'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = adminAuth;
