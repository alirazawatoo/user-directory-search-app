import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSingleUser } from '../store/UserSlice'

export const useUserDetails = (id) => {
  const dispatch = useDispatch()
  const { selectedUser, status, error } = useSelector((state) => state.users)

  useEffect(() => {
    if (!selectedUser || selectedUser.id !== parseInt(id)) {
      dispatch(fetchSingleUser(id))
    }
  }, [id, selectedUser, dispatch])

  return {
    user: selectedUser,
    status,
    error
  }
} 