import { useState, useEffect } from 'react'
import Calendar from '../components/Calendar/calendar'
import TodoList from '../components/TodoList/todoList'
import EventModal from '../components/Events/eventModal'
import Topbar from '../components/Layout/topbar'
import Sidebar from '../components/Layout/sidebar'
import { getEvents, createEvent, deleteEvent } from '../services/eventService'
import { getTasks } from '../services/taskService'

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [tasks, setTasks]   = useState([])
  const [modal, setModal]   = useState({ open: false, date: null })

  useEffect(() => {
    getEvents().then(r => setEvents(r.data))
    getTasks().then(r => setTasks(r.data))
  }, [])

  // Map back-end events to the shape FullCalendar expects
  const calendarEvents = events.map(e => ({
    id:    e._id,
    title: e.title,
    start: e.startDate,
    end:   e.endDate || e.startDate,
  }))

  const handleDateClick = (info) => setModal({ open: true, date: info.dateStr })

  const handleEventClick = async (info) => {
    if (window.confirm(`Delete "${info.event.title}"?`)) {
      await deleteEvent(info.event.id)
      setEvents(prev => prev.filter(e => e._id !== info.event.id))
    }
  }

  const handleCreateEvent = async (eventData) => {
    const res = await createEvent(eventData)
    setEvents(prev => [...prev, res.data])
    setModal({ open: false })
  }

  return (
    <div className="app-layout">
      <Topbar />
      <div className="main-layout">
        <Sidebar />
        <main className="dashboard">
          <Calendar
            events={calendarEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
          <TodoList tasks={tasks} setTasks={setTasks} />
          {modal.open && (
            <EventModal
              date={modal.date}
              onSubmit={handleCreateEvent}
              onClose={() => setModal({ open: false })}
            />
          )}
        </main>
      </div>
    </div>
  )
}
