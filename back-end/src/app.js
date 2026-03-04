const express    = require('express')
const cors       = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes     = require('./routes/authRoutes')
const taskRoutes     = require('./routes/taskRoutes')
const eventRoutes    = require('./routes/eventRoutes')
const reminderRoutes = require('./routes/reminderRoutes')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',  // your React dev server
  credentials: true                 // required for cookies to work cross-origin
}))

// Public routes
app.use('/api/auth', authRoutes)

// Protected routes — must be logged in
const protect = require('./middleware/protect')
app.use('/api/tasks',     protect, taskRoutes)
app.use('/api/events',    protect, eventRoutes)
app.use('/api/reminders', protect, reminderRoutes)

module.exports = app