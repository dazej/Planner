const Task = require("../models/Task");

const getAllTasks = async () => {
  return await Task.find();
};

const createTask = async (data) => {
  return await Task.create(data);
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTask
};