import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSingleUser } from '../store/UserSlice'

const parseUserId = (raw) => (/^[1-9]\d*$/.test(raw ?? '') ? Number(raw) : null)

const INVALID_ID = { message: 'User not found', code: 'not_found' }

export function useUserDetails(rawId) {
  const dispatch = useDispatch()
  const id = parseUserId(rawId)
  const detail = useSelector((state) => state.users.detail)

  useEffect(() => {
    if (id === null) return undefined
    const request = dispatch(fetchSingleUser({ id }))
    return () => request.abort()
  }, [dispatch, id])

  const retry = useCallback(() => {
    if (id !== null) dispatch(fetchSingleUser({ id, force: true }))
  }, [dispatch, id])

  if (id === null) {
    return { user: null, status: 'failed', error: INVALID_ID, retry }
  }

  // Until the effect has dispatched for this id, the slot still describes
  // the previously viewed user.
  if (detail.id !== id) {
    return { user: null, status: 'loading', error: null, retry }
  }
  return { user: detail.user, status: detail.status, error: detail.error, retry }
}
