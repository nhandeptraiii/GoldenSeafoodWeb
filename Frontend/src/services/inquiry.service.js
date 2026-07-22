import axiosClient from '../api/axios'

export async function submitContactInquiry(payload) {
  const response = await axiosClient.post('/inquiries/contact', payload)
  return response.data
}

export async function submitBasketInquiry(payload) {
  const response = await axiosClient.post('/inquiries/basket', payload)
  return response.data
}
