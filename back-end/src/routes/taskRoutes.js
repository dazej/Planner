const express = require("express");
const router = express.Router();
const controller = require("../controllers/taskController");

router.get("/", controller.getTasks);
router.post("/", controller.createTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;