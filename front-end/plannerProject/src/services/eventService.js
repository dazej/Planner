import axios from 'axios'
const BASE = 'http://localhost:5000/api/events'

export const getEvents   = ()       => axios.get(BASE)
export const createEvent = (data)   => axios.post(BASE, data)
export const updateEvent = (id, data) => axios.put(`${BASE}/${id}`, data)
export const deleteEvent = (id)     => axios.delete(`${BASE}/${id}`)