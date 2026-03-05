const Task = require('../models/tasks')
const TaskSeries = require('../models/tasksSeries')

// Delete a single instance only
exports.deleteOne = async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { deleted: true })
    res.json({ message: 'Task instance deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Delete the entire repeating series
exports.deleteSeries = async (req, res) => {
  try {
    const { seriesId } = req.params
    // Soft delete all instances in the series
    await Task.updateMany({ seriesId }, { deleted: true })
    // Also remove the series itself
    await TaskSeries.findByIdAndDelete(seriesId)
    res.json({ message: 'Entire series deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get all tasks (excluding soft-deleted ones)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, deleted: false })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Create a task — with optional repeat
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, repeat } = req.body
    const isRepeating = repeat && repeat.frequency !== 'none'

    let seriesId = null

    if (isRepeating) {
      const series = await TaskSeries.create({ title, description, repeat })
      seriesId = series._id

      // Generate instances for the next 90 days
      const instances = generateInstances({ title, description, dueDate, repeat, seriesId, userId: req.user.id })
      await Task.insertMany(instances)
      return res.status(201).json({ message: 'Repeating task series created', seriesId })
    }

    const task = await Task.create({ ...req.body, userId: req.user.id })
    res.status(201).json(task)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Helper — generates date instances based on repeat rules
function generateInstances({ title, description, dueDate, repeat, seriesId, userId }) {
  const instances = []
  const start = new Date(dueDate)
  const end = repeat.endsOn ? new Date(repeat.endsOn) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  let current = new Date(start)

  while (current <= end) {
    instances.push({ title, description, dueDate: new Date(current), seriesId, userId })

    if (repeat.frequency === 'daily')   current.setDate(current.getDate() + repeat.interval)
    if (repeat.frequency === 'weekly')  current.setDate(current.getDate() + 7 * repeat.interval)
    if (repeat.frequency === 'monthly') current.setMonth(current.getMonth() + repeat.interval)
    if (repeat.frequency === 'yearly')  current.setFullYear(current.getFullYear() + repeat.interval)
  }

  return instances
}