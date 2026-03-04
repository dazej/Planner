const jwt  = require('jsonwebtoken')
const User = require('../models/user')

module.exports = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated — please log in' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user to request
    req.user = await User.findById(decoded.id)
    if (!req.user) {
      return res.status(401).json({ error: 'User no longer exists' })
    }

    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}