import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,   // sends the httpOnly JWT cookie on every request
})

export default api
