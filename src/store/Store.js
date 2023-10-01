import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './UserSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      users: usersReducer,
    },
  })

export const store = makeStore()
