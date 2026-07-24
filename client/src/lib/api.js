import axios from 'axios'

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'https://blog-app-rdnu.onrender.com',
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: true,
  timeout: 15000, // never let a hung request spin the UI forever
})

api.interceptors.request.use((config) => {
  try {
    const info = JSON.parse(localStorage.getItem('user-info') || 'null')
    if (info?.token) {
      config.headers.Authorization = `Bearer ${info.token}`
    }
  } catch {
    // ignore malformed user-info
  }
  return config
})

export default api
