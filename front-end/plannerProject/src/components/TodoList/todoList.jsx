import { useState } from 'react'
import TaskItem from './taskItem'
import { createTask, updateTask, deleteTask } from '../../services/taskService'
import './todoList.css'

export default function TodoList({ tasks, setTasks }) {
  const [input, setInput] = useState('')

  const handleAdd = async () => {
    if (!input.trim()) return
    const res = await createTask({ title: input.trim() })
    setTasks(prev => [...prev, res.data])
    setInput('')
  }

  const handleToggle = async (id) => {
    const task = tasks.find(t => t._id === id)
    const res = await updateTask(id, { done: !task.done })
    setTasks(prev => prev.map(t => t._id === id ? res.data : t))
  }

  const handleDelete = async (id) => {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t._id !== id))
  }

  return (
    <section className="todo-list">
      <h2>Tasks</h2>
      <div className="add-task-row">
        <input
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      {tasks.length === 0
        ? <p>No tasks yet.</p>
        : <ul>{tasks.map(t => (
            <TaskItem key={t._id} task={t} onToggle={handleToggle} onDelete={handleDelete} />
          ))}</ul>
      }
    </section>
  )
}
