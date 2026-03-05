import { useState } from 'react'
import './eventModal.css'

export default function EventModal({ date, onSubmit, onClose }) {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    startDate:   date || '',
    endDate:     '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.startDate) return
    onSubmit(form)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>New Event</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Event title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
          />
          <label>Start date</label>
          <input
            type="datetime-local"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
          <label>End date (optional)</label>
          <input
            type="datetime-local"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
          <div className="modal-buttons">
            <button type="submit">Add Event</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
