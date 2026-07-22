import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  current: 'vi',
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.current = state.current === 'vi' ? 'en' : 'vi'
    },
    setLanguage: (state, action) => {
      state.current = action.payload
    },
  },
})

export const { toggleLanguage, setLanguage } = languageSlice.actions
export default languageSlice.reducer
