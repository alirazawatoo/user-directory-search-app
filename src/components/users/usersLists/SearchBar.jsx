import { useState } from 'react'
import { useDebouncedCallback } from '../../../hooks/useDebouncedCallback'
import { useUserSearchParams } from '../../../hooks/useUserSearchParams'

export const SEARCH_DEBOUNCE_MS = 300

export default function SearchBar() {
  const { query, setQuery } = useUserSearchParams()
  const [draft, setDraft] = useState(query)
  const [syncedQuery, setSyncedQuery] = useState(query)
  const debouncedSetQuery = useDebouncedCallback(setQuery, SEARCH_DEBOUNCE_MS)

  // The URL is the source of truth. When it changes from outside the input
  // (Back/Forward, a "clear search" link), show that value instead of the draft.
  if (query !== syncedQuery) {
    setSyncedQuery(query)
    if (query !== draft.trim()) setDraft(query)
  }

  const commitNow = (value) => {
    debouncedSetQuery.cancel()
    setQuery(value)
  }

  return (
    <form
      role="search"
      className="flex flex-col gap-1"
      onSubmit={(event) => {
        event.preventDefault()
        commitNow(draft)
      }}
    >
      <label htmlFor="directory-search" className="text-sm font-semibold text-gray-800">
        Search by name or email
      </label>
      <input
        id="directory-search"
        type="search"
        autoComplete="off"
        spellCheck={false}
        value={draft}
        aria-describedby="directory-search-hint"
        className="w-full rounded-lg border border-gray-400 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
        onChange={(event) => {
          setDraft(event.target.value)
          debouncedSetQuery.run(event.target.value)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && draft) {
            event.preventDefault()
            setDraft('')
            commitNow('')
          }
        }}
      />
      <p id="directory-search-hint" className="text-sm text-gray-600">
        Results update as you type. Press Escape to clear.
      </p>
    </form>
  )
}
