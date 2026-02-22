import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [newEvent, setNewEvent] = useState({ title: '', date: '', endDate: '' })
  const [newTask, setNewTask] = useState('')

  // Fetch tasks from back-end
  useEffect(() => {
    fetch("http://localhost:3000/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Tasks fetch failed:", err))
  }, [])

  // Fetch events from back-end
  useEffect(() => {
    fetch("http://localhost:3000/api/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Events fetch failed:", err))
  }, [])

  // Format events for FullCalendar
  const calendarEvents = events.map(event => ({
    id: event._id,
    title: event.title,
    start: event.date,
    end: event.endDate || event.date,
  }))

  // Clicking an empty date opens the modal
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr)
    setNewEvent({ title: '', date: info.dateStr, endDate: '' })
    setShowModal(true)
  }

  // Clicking an existing event shows its title
  const handleEventClick = (info) => {
    if (window.confirm(`Delete event "${info.event.title}"?`)) {
      setEvents(prev => prev.filter(e => e._id !== info.event.id))
      // TODO: also call DELETE /api/events/:id on your back-end
    }
  }

  // Add a new event (locally + back-end)
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return

    fetch("http://localhost:3000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent)
    })
      .then(res => res.json())
      .then(data => {
        setEvents(prev => [...prev, data])
        setShowModal(false)
        setNewEvent({ title: '', date: '', endDate: '' })
      })
      .catch(err => console.error("Create event failed:", err))
  }

  // Add a new task (locally + back-end)
  const handleAddTask = () => {
    if (!newTask.trim()) return

    fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask })
    })
      .then(res => res.json())
      .then(data => {
        setTasks(prev => [...prev, data])
        setNewTask('')
      })
      .catch(err => console.error("Create task failed:", err))
  }

  // Toggle task done/undone
  const handleToggleTask = (id) => {
    setTasks(prev =>
      prev.map(t => t._id === id ? { ...t, done: !t.done } : t)
    )
    // TODO: also call PATCH /api/tasks/:id on your back-end
  }

  return (
    <div className="app">

      <h1>My Planner</h1>

      {/* ── CALENDAR ───────────────────────── */}
      <section className="calendar-section">
        <h2>Calendar</h2>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={calendarEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          selectable={true}
          height="auto"
        />
      </section>

      {/* ── ADD EVENT MODAL ─────────────────── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>New Event on {selectedDate}</h3>
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <label>Start date</label>
            <input
              type="date"
              value={newEvent.date}
              onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <label>End date (optional)</label>
            <input
              type="date"
              value={newEvent.endDate}
              onChange={e => setNewEvent({ ...newEvent, endDate: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={handleAddEvent}>Add Event</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TO-DO LIST ──────────────────────── */}
      <section className="tasks-section">
        <h2>Tasks</h2>
        <div className="add-task-row">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTask()}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          <ul>
            {tasks.map(task => (
              <li
                key={task._id}
                onClick={() => handleToggleTask(task._id)}
                style={{
                  textDecoration: task.done ? 'line-through' : 'none',
                  cursor: 'pointer',
                  color: task.done ? '#aaa' : 'inherit'
                }}
              >
                {task.title}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── EVENTS LIST ─────────────────────── */}
      <section className="events-section">
        <h2>Upcoming Events</h2>
        {events.length === 0 ? (
          <p>No events yet. Click a date on the calendar to add one.</p>
        ) : (
          <ul>
            {events.map(event => (
              <li key={event._id}>
                <strong>{event.title}</strong> — {event.date}
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  )
}

export default App
