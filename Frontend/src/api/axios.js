import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Let the browser/Axios generate multipart/form-data with the correct boundary.
    delete config.headers['Content-Type']
  }

  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('gs_admin_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Unexpected error from API service'
    return Promise.reject(new Error(message))
  },
)

export default axiosClient
