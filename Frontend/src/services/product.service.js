import axiosClient from '../api/axios'

export async function getProducts(params = {}) {
  const response = await axiosClient.get('/products', { params })
  return response.data?.data || { products: [], pagination: null }
}

export async function getFeaturedProducts() {
  const response = await axiosClient.get('/products/featured')
  return response.data?.data || []
}

export async function getProductBySlug(slug) {
  const response = await axiosClient.get(`/products/${slug}`)
  return response.data?.data
}


export async function getAdminProducts(params = {}) {
  const response = await axiosClient.get('/admin/products', { params })
  return response.data?.data || { products: [], pagination: null }
}

export async function getAdminProductById(id) {
  const response = await axiosClient.get(`/admin/products/${id}`)
  return response.data?.data
}

export async function createAdminProduct(payload) {
  const response = await axiosClient.post('/admin/products', payload)
  return response.data?.data
}

export async function updateAdminProduct(id, payload) {
  const response = await axiosClient.put(`/admin/products/${id}`, payload)
  return response.data?.data
}

export async function deleteAdminProduct(id) {
  const response = await axiosClient.delete(`/admin/products/${id}`)
  return response.data
}
