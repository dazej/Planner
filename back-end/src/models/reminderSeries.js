const mongoose = require('mongoose')

const reminderSeriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: String,
  repeat: {
    frequency: { type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'], default: 'none' },
    interval: { type: Number, default: 1 },
    daysOfWeek: [Number],
    endsOn: Date,
  },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('reminderSeries', reminderSeriesSchema)