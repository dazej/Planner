const express   = require('express')
const router    = express.Router()
const { body }  = require('express-validator')
const passport  = require('../config/passport')
const authController = require('../controllers/authController')
const protect = require('../middleware/protect')

// Validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Must contain a number')
]

const loginRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
]

router.post('/register', registerRules, authController.register)
router.post('/login',    loginRules,    authController.login)
router.post('/logout',                  authController.logout)
router.get('/me',        protect,       authController.getMe)

// Google OAuth — step 1: redirect user to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// Google OAuth — step 2: Google redirects back here after user approves
router.get('/google/callback',
  (req, res, next) => {
    console.log('OAuth callback hit — code present:', !!req.query.code, '| error:', req.query.error)
    next()
  },
  passport.authenticate('google', { session: false, failureRedirect: process.env.CLIENT_URL + '/login' }),
  authController.googleCallback
)

module.exports = router