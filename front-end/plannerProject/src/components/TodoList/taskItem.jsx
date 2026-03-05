export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task._id)}
      />
      <span className="task-title">{task.title}</span>
      <button className="task-delete" onClick={() => onDelete(task._id)}>✕</button>
    </li>
  )
}
