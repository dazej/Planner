const express       = require('express')
const cors          = require('cors')
const cookieParser  = require('cookie-parser')
const session       = require('express-session')
const passport      = require('./config/passport')

const authRoutes     = require('./routes/authRoutes')
const taskRoutes     = require('./routes/taskRoutes')
const eventRoutes    = require('./routes/eventRoutes')
const reminderRoutes = require('./routes/reminderRoutes')

const app = express()

// Log every incoming request so we can see what's hitting the server
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.path} — origin: ${req.headers.origin || '(none)'}`)
  next()
})

// Allow all localhost origins — handles both the React app and OAuth redirects
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost')) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// Session is required for Passport's OAuth state during the Google redirect/callback flow
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())

// Public routes
app.use('/api/auth', authRoutes)

// Protected routes — must be logged in
const protect = require('./middleware/protect')
app.use('/api/tasks',     protect, taskRoutes)
app.use('/api/events',    protect, eventRoutes)
app.use('/api/reminders', protect, reminderRoutes)

// Must be last — catches any unhandled errors and logs them
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

module.exports = app