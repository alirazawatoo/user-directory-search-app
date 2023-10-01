import { describe, it, expect } from 'vitest'
import reducer, { fetchUsers, fetchSingleUser, initialState } from '../UserSlice'

const listArgs = (query, page = 1) => ({ query, page })
const result = (query, names) => ({
  users: names.map((firstName, index) => ({ id: index + 1, firstName })),
  total: names.length,
  query,
  page: 1,
})

describe('users reducer', () => {
  it('ignores a slow response that was overtaken by a newer search', () => {
    let state = reducer(initialState, fetchUsers.pending('req-old', listArgs('ro')))
    state = reducer(state, fetchUsers.pending('req-new', listArgs('rosa')))
    state = reducer(state, fetchUsers.fulfilled(result('rosa', ['Rosa']), 'req-new', listArgs('rosa')))
    state = reducer(state, fetchUsers.fulfilled(result('ro', ['Rosa', 'Soren']), 'req-old', listArgs('ro')))

    expect(state.list.query).toBe('rosa')
    expect(state.list.items.map((user) => user.firstName)).toEqual(['Rosa'])
    expect(state.list.status).toBe('succeeded')
  })

  it('ignores a failure from an overtaken request', () => {
    let state = reducer(initialState, fetchUsers.pending('req-old', listArgs('a')))
    state = reducer(state, fetchUsers.pending('req-new', listArgs('ab')))
    state = reducer(state, fetchUsers.rejected(new Error('boom'), 'req-old', listArgs('a')))

    expect(state.list.status).toBe('loading')
    expect(state.list.error).toBeNull()
  })

  it('does not report an aborted request as an error', () => {
    let state = reducer(initialState, fetchUsers.pending('req-1', listArgs('')))
    const abortError = Object.assign(new Error('Aborted'), { name: 'AbortError' })
    const aborted = fetchUsers.rejected(abortError, 'req-1', listArgs(''))
    aborted.meta.aborted = true
    state = reducer(state, aborted)

    expect(state.list.status).toBe('loading')
    expect(state.list.error).toBeNull()
  })

  it('replaces the page of results instead of appending to it', () => {
    let state = reducer(initialState, fetchUsers.pending('p1', listArgs('', 1)))
    state = reducer(state, fetchUsers.fulfilled(result('', ['A', 'B']), 'p1', listArgs('', 1)))
    state = reducer(state, fetchUsers.pending('p2', listArgs('', 2)))
    state = reducer(state, fetchUsers.fulfilled(result('', ['C']), 'p2', listArgs('', 2)))

    expect(state.list.items.map((user) => user.firstName)).toEqual(['C'])
    expect(state.list.page).toBe(2)
  })

  it('keeps list and detail state apart', () => {
    let state = reducer(initialState, fetchUsers.pending('list', listArgs('')))
    state = reducer(state, fetchUsers.fulfilled(result('', ['A']), 'list', listArgs('')))
    state = reducer(state, fetchSingleUser.pending('detail', { id: 7 }))
    state = reducer(
      state,
      fetchSingleUser.rejected(Object.assign(new Error('User not found'), { code: 'not_found' }), 'detail', { id: 7 })
    )

    expect(state.list.status).toBe('succeeded')
    expect(state.detail).toMatchObject({
      id: 7,
      status: 'failed',
      error: { message: 'User not found', code: 'not_found' },
    })
  })
})
