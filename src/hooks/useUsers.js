import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../store/UserSlice'
import { filterUsersByName } from '../utils/UserFilters'

export const useUsers = () => {
  const dispatch = useDispatch()
  const { 
    users, 
    hasMore, 
    status, 
    error, 
    searchTerm,
    page 
  } = useSelector((state) => state.users)

  const observer = useRef()
  const initialFetchDone = useRef(false)

  const lastUserElementRef = useCallback(node => {
    if (status === 'loading') return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        dispatch(fetchUsers(page + 1))
      }
    })
    
    if (node) observer.current.observe(node)
  }, [status, hasMore, page, dispatch])

  useEffect(() => {
    if (!initialFetchDone.current && users.length === 0 && status === 'idle') {
      initialFetchDone.current = true
      dispatch(fetchUsers(1))
    }
  }, [dispatch, users.length, status])

  const filteredUsers = filterUsersByName(users, searchTerm)

  return {
    filteredUsers,
    status,
    error,
    searchTerm,
    hasMore,
    lastUserElementRef
  }
} 