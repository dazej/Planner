const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'eventSeries', default: null },
  title: { type: String, required: true },
  description: String,
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('event', eventSchema)