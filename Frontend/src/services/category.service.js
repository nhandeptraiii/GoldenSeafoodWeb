import axiosClient from '../api/axios'

export async function getCategories() {
  const response = await axiosClient.get('/categories')
  return response.data?.data || []
}


export async function getAdminCategories() {
  const response = await axiosClient.get('/admin/categories')
  return response.data?.data || []
}

export async function createAdminCategory(payload) {
  const response = await axiosClient.post('/admin/categories', payload)
  return response.data?.data
}

export async function updateAdminCategory(id, payload) {
  const response = await axiosClient.put(`/admin/categories/${id}`, payload)
  return response.data?.data
}

export async function deleteAdminCategory(id) {
  const response = await axiosClient.delete(`/admin/categories/${id}`)
  return response.data
}
