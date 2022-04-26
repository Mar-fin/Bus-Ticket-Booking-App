const jwt = require('jsonwebtoken');
// using config becoz we need the Secret
const config = require('config');

//middleware function takes 3 things(req,res,next), it has access to request-response cycle, next is a callback
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authoroization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    req.admin = decoded.admin;

    // calling the next. when we call this fn, next piece of middleware will going to run
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
