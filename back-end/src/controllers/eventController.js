const Event = require('../models/event')
const EventSeries = require('../models/eventSeries')

// Delete a single instance only
exports.deleteOne = async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, { deleted: true })
    res.json({ message: 'Event instance deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Delete the entire repeating series
exports.deleteSeries = async (req, res) => {
  try {
    const { seriesId } = req.params
    // Soft delete all instances in the series
    await Event.updateMany({ seriesId }, { deleted: true })
    // Also remove the series itself
    await EventSeries.findByIdAndDelete(seriesId)
    res.json({ message: 'Entire series deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get all events (excluding soft-deleted ones)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ deleted: false })
    res.json(events)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Create an event — with optional repeat
exports.createEvent = async (req, res) => {
  try {
    const { title, description, dueDate, repeat } = req.body
    const isRepeating = repeat && repeat.frequency !== 'none'

    let seriesId = null

    if (isRepeating) {
      const series = await EventSeries.create({ title, description, repeat })
      seriesId = series._id

      // Generate instances for the next 90 days
      const instances = generateInstances({ title, description, dueDate, repeat, seriesId })
      await Event.insertMany(instances)
      return res.status(201).json({ message: 'Repeating event series created', seriesId })
    }

    const event = await Event.create({ title, description, dueDate, seriesId: null })
    res.status(201).json(event)

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