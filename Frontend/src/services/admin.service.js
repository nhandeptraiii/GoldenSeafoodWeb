import axiosClient from '../api/axios'

const ADMIN_TOKEN_KEY = 'gs_admin_token'
const ADMIN_USER_KEY = 'gs_admin_user'

export function getStoredAdminSession() {
  if (typeof window === 'undefined') {
    return { token: '', user: null }
  }

  const token = window.localStorage.getItem(ADMIN_TOKEN_KEY) || ''
  const rawUser = window.localStorage.getItem(ADMIN_USER_KEY)

  return {
    token,
    user: rawUser ? JSON.parse(rawUser) : null,
  }
}

export function saveAdminSession(session) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ADMIN_TOKEN_KEY, session.token)
  window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(session.user || null))
}

export function clearAdminSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(ADMIN_TOKEN_KEY)
  window.localStorage.removeItem(ADMIN_USER_KEY)
}

export async function adminLogin(payload) {
  const response = await axiosClient.post('/admin/login', payload)
  return response.data?.data
}

export async function getAdminProfile() {
  const response = await axiosClient.get('/admin/me')
  return response.data?.data
}

export async function getAdminInquiries(params = {}) {
  const response = await axiosClient.get('/admin/inquiries', { params })
  return response.data?.data || { inquiries: [], pagination: null }
}

export async function getAdminInquiryById(id) {
  const response = await axiosClient.get(`/admin/inquiries/${id}`)
  return response.data?.data
}

export async function updateAdminInquiryStatus(id, status) {
  const response = await axiosClient.patch(`/admin/inquiries/${id}/status`, { status })
  return response.data?.data
}

export async function deleteAdminInquiry(id) {
  const response = await axiosClient.delete(`/admin/inquiries/${id}`)
  return response.data
}
