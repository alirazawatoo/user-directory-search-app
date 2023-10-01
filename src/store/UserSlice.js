import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '../services/UserService'

const LIMIT = 12

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page) => {
    return await userService.getUsers(page, LIMIT)
  }
)

export const fetchSingleUser = createAsyncThunk(
  'users/fetchSingleUser',
  async (id) => {
    return await userService.getSingleUser(id)
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    selectedUser: null,
    page: 0,
    hasMore: true,
    status: 'idle',
    error: null,
    searchTerm: '',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.users = [...state.users, ...action.payload.users]
        state.page = action.payload.page
        state.hasMore = action.payload.total > state.users.length
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchSingleUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.selectedUser = action.payload
      })
      .addCase(fetchSingleUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { setSearchTerm } = usersSlice.actions
export default usersSlice.reducer