import api from '../api/axios'

export const getMe    = ()     => api.get('/auth/me')
export const logout   = ()     => api.post('/auth/logout')
