const mongoose = require('mongoose')

const eventSeriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  repeat: {
    frequency: { type: String, enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'], default: 'none' },
    interval: { type: Number, default: 1 },
    daysOfWeek: [Number],
    endsOn: Date,
  },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('eventSeries', eventSeriesSchema)