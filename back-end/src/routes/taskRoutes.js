const express = require('express')
const router = express.Router()
const taskController = require('../controllers/taskController')

router.get('/',                       taskController.getAllTasks)
router.post('/',                      taskController.createTask)
router.delete('/:id',                 taskController.deleteOne)
router.delete('/series/:seriesId',    taskController.deleteSeries)

module.exports = router