import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '../services/UserService'

const toError = (error) => ({ message: error.message, code: error.code ?? null })

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  ({ query, page }, { signal }) => userService.getUsers({ query, page, signal }),
  {
    // Coming back to a page that is already on screen should not refetch it.
    condition: ({ query, page, force }, { getState }) => {
      const { list } = getState().users
      return Boolean(force) || !(list.status === 'succeeded' && list.query === query && list.page === page)
    },
  }
)

export const fetchSingleUser = createAsyncThunk(
  'users/fetchSingleUser',
  ({ id }, { signal }) => userService.getSingleUser(id, { signal }),
  {
    condition: ({ id, force }, { getState }) => {
      const { detail } = getState().users
      return Boolean(force) || !(detail.status === 'succeeded' && detail.id === id)
    },
  }
)

export const initialState = {
  list: {
    items: [],
    total: 0,
    query: '',
    page: 1,
    status: 'idle',
    error: null,
    requestId: null,
  },
  detail: {
    id: null,
    user: null,
    status: 'idle',
    error: null,
    requestId: null,
  },
}

// Each slot remembers the requestId of its latest request. A response that
// arrives for an older request (a slow search overtaken by a newer one) is
// dropped instead of overwriting what the user asked for last.
const isLatest = (slot, action) => slot.requestId === action.meta.requestId

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.list.status = 'loading'
        state.list.error = null
        state.list.requestId = action.meta.requestId
        state.list.query = action.meta.arg.query
        state.list.page = action.meta.arg.page
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        if (!isLatest(state.list, action)) return
        state.list.status = 'succeeded'
        state.list.items = action.payload.users
        state.list.total = action.payload.total
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        if (!isLatest(state.list, action) || action.meta.aborted) return
        state.list.status = 'failed'
        state.list.error = toError(action.error)
      })
      .addCase(fetchSingleUser.pending, (state, action) => {
        state.detail.status = 'loading'
        state.detail.error = null
        state.detail.requestId = action.meta.requestId
        if (state.detail.id !== action.meta.arg.id) {
          state.detail.id = action.meta.arg.id
          state.detail.user = null
        }
      })
      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        if (!isLatest(state.detail, action)) return
        state.detail.status = 'succeeded'
        state.detail.user = action.payload
      })
      .addCase(fetchSingleUser.rejected, (state, action) => {
        if (!isLatest(state.detail, action) || action.meta.aborted) return
        state.detail.status = 'failed'
        state.detail.error = toError(action.error)
      })
  },
})

export default usersSlice.reducer
