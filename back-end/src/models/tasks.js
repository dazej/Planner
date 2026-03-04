const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'taskSeries', default: null },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  done: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },  // soft delete — hides this instance only
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('tasks', taskSchema)