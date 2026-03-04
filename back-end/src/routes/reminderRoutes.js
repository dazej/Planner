const express = require('express')
const router = express.Router()
const reminderController = require('../controllers/reminderController')

router.get('/',                       reminderController.getAllReminders)
router.post('/',                      reminderController.createReminder)
router.delete('/:id',                 reminderController.deleteOne)
router.delete('/series/:seriesId',    reminderController.deleteSeries)

module.exports = router