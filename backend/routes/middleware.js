const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('token'); // Assuming token is sent as 'x-auth-token' header

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, '1234567'); // Replace '1234567' with your actual secret key

    req.user = decoded; // Set user object in request
    next(); // Move to next middleware
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = auth;
