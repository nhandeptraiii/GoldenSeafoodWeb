import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import languageReducer from './slices/languageSlice'
import inquiryReducer from './slices/inquirySlice'

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null)
  },
  setItem(_key, value) {
    return Promise.resolve(value)
  },
  removeItem() {
    return Promise.resolve()
  },
})

const createLocalStorage = () => ({
  getItem(key) {
    return Promise.resolve(window.localStorage.getItem(key))
  },
  setItem(key, value) {
    window.localStorage.setItem(key, value)
    return Promise.resolve(value)
  },
  removeItem(key) {
    window.localStorage.removeItem(key)
    return Promise.resolve()
  },
})

const storage =
  typeof window !== 'undefined' ? createLocalStorage() : createNoopStorage()

const languagePersistConfig = {
  key: 'language',
  storage,
  whitelist: ['current'],
}

const inquiryPersistConfig = {
  key: 'inquiry',
  storage,
  whitelist: ['items'],
}

export const store = configureStore({
  reducer: {
    language: persistReducer(languagePersistConfig, languageReducer),
    inquiry: persistReducer(inquiryPersistConfig, inquiryReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
