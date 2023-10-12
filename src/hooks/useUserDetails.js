import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSingleUser } from '../store/UserSlice'

export const useUserDetails = (id) => {
  const dispatch = useDispatch()
  const { selectedUser, status, error } = useSelector((state) => state.users)

  useEffect(() => {
    const numericId = Number.parseInt(id, 10)

    if (Number.isNaN(numericId)) {
      return
    }

    if (!selectedUser || selectedUser.id !== numericId) {
      dispatch(fetchSingleUser(numericId))
    }
  }, [id, selectedUser, dispatch])

  return {
    user: selectedUser,
    status,
    error
  }
} 