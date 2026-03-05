const User = require('../models/user')
const jwt  = require('jsonwebtoken')
const { validationResult } = require('express-validator')

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Send token as httpOnly cookie + JSON response
const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id)

  res.cookie('token', token, {
    httpOnly: true,       // JS cannot access this cookie — prevents XSS
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
    sameSite: 'strict',   // prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
  })

  res.status(statusCode).json({ user })
}

// REGISTER
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    // Check if user already exists
    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ error: 'An account with that email already exists' })
    }

    const user = await User.create({ name, email, password })
    sendToken(user, 201, res)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// LOGIN
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Find user (re-include password for comparison)
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const match = await user.comparePassword(password)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' })
      // Note: same message for both cases — never reveal which field is wrong
    }

    sendToken(user, 200, res)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// LOGOUT
exports.logout = (_req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) })
  res.json({ message: 'Logged out' })
}

// GOOGLE OAUTH CALLBACK
// Called after Google redirects back — Passport has already found/created the user
exports.googleCallback = (req, res) => {
  const token = generateToken(req.user._id)

  // sameSite must be 'lax' (not 'strict') so the cookie is sent on the redirect from Google
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.redirect(process.env.CLIENT_URL + '/dashboard')
}

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}