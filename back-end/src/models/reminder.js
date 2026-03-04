const mongoose = require('mongoose')

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'reminderSeries', default: null },
  title: { type: String, required: true },
  message: String,
  remindAt: { type: Date, required: true },
  done: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('reminder', reminderSchema)