import axiosClient from '../api/axios'

export async function uploadAttachment(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosClient.post('/upload', formData)

  return response.data?.data?.url
}


async function uploadAdminMedia(endpoint, fieldName, file) {
  const formData = new FormData()
  formData.append(fieldName, file)

  const response = await axiosClient.post(endpoint, formData)
  const url = response.data?.data?.url

  if (!url) {
    throw new Error('Upload succeeded but the API did not return a file URL.')
  }

  return url
}

export function uploadProductImage(file) {
  return uploadAdminMedia('/admin/products/upload-image', 'image', file)
}

export function uploadCategoryIcon(file) {
  return uploadAdminMedia('/admin/categories/upload-icon', 'icon', file)
}
