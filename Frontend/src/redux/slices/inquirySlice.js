import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const normalizeItem = (item) => ({
  product_id: item.product_id,
  product_name: item.product_name,
  quantity: item.quantity ?? 1,
  specifications: item.specifications ?? '',
  notes: item.notes ?? '',
  slug: item.slug,
  thumbnail_url: item.thumbnail_url,
})

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {
    addInquiryItem: (state, action) => {
      const incoming = normalizeItem(action.payload)
      const existed = state.items.find((item) => item.product_id === incoming.product_id)
      if (!existed) {
        state.items.push(incoming)
      }
    },
    removeInquiryItem: (state, action) => {
      state.items = state.items.filter((item) => item.product_id !== action.payload)
    },
    updateInquiryItem: (state, action) => {
      const { product_id, changes } = action.payload
      const target = state.items.find((item) => item.product_id === product_id)
      if (target) {
        Object.assign(target, changes)
      }
    },
    clearInquiryItems: (state) => {
      state.items = []
    },
  },
})

export const { addInquiryItem, removeInquiryItem, updateInquiryItem, clearInquiryItems } =
  inquirySlice.actions

export default inquirySlice.reducer
