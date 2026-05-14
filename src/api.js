import axios from "axios"
import { loadAuth } from "./routes/storage.js"

const api = axios.create({
  baseURL: 'https://career-guidance-platform-backend-26j6.onrender.com',
})

api.interceptors.request.use((config) => {
  const auth = loadAuth()

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})

export default api
