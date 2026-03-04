const Reminder = require('../models/reminder')
const ReminderSeries = require('../models/reminderSeries')

// Delete a single instance only
exports.deleteOne = async (req, res) => {
  try {
    await Reminder.findByIdAndUpdate(req.params.id, { deleted: true })
    res.json({ message: 'Reminder instance deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Delete the entire repeating series
exports.deleteSeries = async (req, res) => {
  try {
    const { seriesId } = req.params
    // Soft delete all instances in the series
    await Reminder.updateMany({ seriesId }, { deleted: true })
    // Also remove the series itself
    await ReminderSeries.findByIdAndDelete(seriesId)
    res.json({ message: 'Entire series deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get all reminders (excluding soft-deleted ones)
exports.getAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ deleted: false })
    res.json(reminders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Create a reminder — with optional repeat
exports.createReminder = async (req, res) => {
  try {
    const { title, description, dueDate, repeat } = req.body
    const isRepeating = repeat && repeat.frequency !== 'none'

    let seriesId = null

    if (isRepeating) {
      const series = await ReminderSeries.create({ title, description, repeat })
      seriesId = series._id

      // Generate instances for the next 90 days
      const instances = generateInstances({ title, description, dueDate, repeat, seriesId })
      await Reminder.insertMany(instances)
      return res.status(201).json({ message: 'Repeating reminder series created', seriesId })
    }

    const reminder = await Reminder.create({ title, description, dueDate, seriesId: null })
    res.status(201).json(reminder)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Helper — generates date instances based on repeat rules
function generateInstances({ title, description, dueDate, repeat, seriesId }) {
  const instances = []
  const start = new Date(dueDate)
  const end = repeat.endsOn ? new Date(repeat.endsOn) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  let current = new Date(start)

  while (current <= end) {
    instances.push({ title, description, dueDate: new Date(current), seriesId })

    if (repeat.frequency === 'daily')   current.setDate(current.getDate() + repeat.interval)
    if (repeat.frequency === 'weekly')  current.setDate(current.getDate() + 7 * repeat.interval)
    if (repeat.frequency === 'monthly') current.setMonth(current.getMonth() + repeat.interval)
    if (repeat.frequency === 'yearly')  current.setFullYear(current.getFullYear() + repeat.interval)
  }

  return instances
}