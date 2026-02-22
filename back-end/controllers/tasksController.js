let tasks = [
  { id: 1, title: "Finish project", completed: false },
  { id: 2, title: "Push to GitHub", completed: true }
];

const getTasks = (req, res) => {
  res.json(tasks);
};

const createTask = (req, res) => {
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

const deleteTask = (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.json({ message: "Task deleted" });
};

module.exports = {
  getTasks,
  createTask,
  deleteTask
};