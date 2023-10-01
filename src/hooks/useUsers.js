import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../store/UserSlice'
import { PAGE_SIZE } from '../services/UserService'
import { useUserSearchParams } from './useUserSearchParams'

export function useUsers() {
  const dispatch = useDispatch()
  const { query, page } = useUserSearchParams()
  const list = useSelector((state) => state.users.list)

  useEffect(() => {
    const request = dispatch(fetchUsers({ query, page }))
    // Leaving this query/page aborts its request, so a slow response for an
    // old search cannot land after the new one.
    return () => request.abort()
  }, [dispatch, query, page])

  const retry = useCallback(
    () => dispatch(fetchUsers({ query, page, force: true })),
    [dispatch, query, page]
  )

  return {
    users: list.items,
    total: list.total,
    status: list.status,
    error: list.error,
    query,
    page,
    totalPages: Math.max(1, Math.ceil(list.total / PAGE_SIZE)),
    retry,
  }
}
