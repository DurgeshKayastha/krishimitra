import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
})

export const getPrices = (params) => api.get('/api/prices', { params })
export const getWeather = (lat, lon) => api.get('/api/weather', { params: { lat, lon } })
export const postGroq = (payload) => api.post('/api/groq', payload)
export const postDisease = (formData) => api.post('/api/disease', formData)
export const postReport = (data) => api.post('/api/report', data)

export default api
