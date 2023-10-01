import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export const parsePage = (raw) => {
  const page = Number(raw)
  return Number.isInteger(page) && page >= 1 ? page : 1
}

// Builds the query string for a directory view; page 1 and an empty search
// are left out so the plain "/" URL stays the canonical first page.
export const directorySearch = ({ query = '', page = 1 }) => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (page > 1) params.set('page', String(page))
  const search = params.toString()
  return search ? `?${search}` : ''
}

export function useUserSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()
  const page = parsePage(searchParams.get('page'))

  // A new search starts from page 1. replace keeps each keystroke out of the
  // history, so Back returns to the previous page rather than a half-typed term.
  const setQuery = useCallback(
    (next) => setSearchParams(directorySearch({ query: next.trim() }), { replace: true }),
    [setSearchParams]
  )

  return { query, page, setQuery }
}
