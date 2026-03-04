const mongoose = require('mongoose')

const taskSeriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  repeat: {
    frequency: { type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'], default: 'none' },
    interval: { type: Number, default: 1 },   // e.g. every 2 weeks
    daysOfWeek: [Number],                      // 0=Sun, 1=Mon, etc. for weekly repeats
    endsOn: Date,                              // optional end date for the series
  },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('taskSeries', taskSeriesSchema)