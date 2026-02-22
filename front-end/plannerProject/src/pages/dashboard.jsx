import { useState, useEffect } from 'react'
import Calendar from '../components/Calendar/calendar'
import TodoList from '../components/TodoList/todoList'
import EventModal from '../components/Events/eventModal'
import { getEvents, createEvent } from '../services/eventService'
import { getTasks } from '../services/taskService'

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [tasks, setTasks]   = useState([])
  const [modal, setModal]   = useState({ open: false, date: null })

  useEffect(() => {
    getEvents().then(r => setEvents(r.data))
    getTasks().then(r => setTasks(r.data))
  }, [])

  const handleDateClick = (info) => setModal({ open: true, date: info.dateStr })

  const handleCreateEvent = async (eventData) => {
    const res = await createEvent(eventData)
    setEvents(prev => [...prev, res.data])
    setModal({ open: false })
  }

  return (
    <div className="dashboard">
      <Calendar events={events} onDateClick={handleDateClick} />
      <TodoList tasks={tasks} setTasks={setTasks} />
      {modal.open && (
        <EventModal
          date={modal.date}
          onSubmit={handleCreateEvent}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  )
}