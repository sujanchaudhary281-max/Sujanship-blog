import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://sujanship-blog.onrender.com',
  withCredentials: true,
  timeout: 90000, // allow enough time for Render free tier cold starts (can take 30-60s)
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
