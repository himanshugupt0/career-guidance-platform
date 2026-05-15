import axios from "axios"
import { loadAuth } from "./routes/storage.js"

const api = axios.create({
  baseURL: 'http://localhost:5000',
})

api.interceptors.request.use((config) => {
  const auth = loadAuth()

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})

export default api
