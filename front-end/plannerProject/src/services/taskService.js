import axios from 'axios'
const BASE = 'http://localhost:5000/api/tasks'

export const getTasks    = ()         => axios.get(BASE)
export const createTask  = (data)     => axios.post(BASE, data)
export const updateTask  = (id, data) => axios.put(`${BASE}/${id}`, data)
export const deleteTask  = (id)       => axios.delete(`${BASE}/${id}`)