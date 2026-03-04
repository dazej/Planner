const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')

router.get('/',                       eventController.getAllEvents)
router.post('/',                      eventController.createEvent)
router.delete('/:id',                 eventController.deleteOne)
router.delete('/series/:seriesId',    eventController.deleteSeries)

module.exports = router