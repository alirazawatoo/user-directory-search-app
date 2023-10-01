import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useUsers } from '../../../hooks/useUsers'
import { directorySearch } from '../../../hooks/useUserSearchParams'
import { PAGE_SIZE } from '../../../services/UserService'
import ErrorMessage from '../../common/ErrorMessage'
import Spinner from '../../common/Spinner'
import NoResults from './NoResults'
import Pagination from './Pagination'
import SearchBar from './SearchBar'
import UserGrid from './UserGrid'

const resultSummary = ({ status, total, page, query, count }) => {
  if (status === 'loading') return 'Loading people…'
  if (status !== 'succeeded' || count === 0) return ''
  const first = (page - 1) * PAGE_SIZE + 1
  const range = `${first}–${first + count - 1}`
  const noun = total === 1 ? 'person' : 'people'
  return query
    ? `Showing ${range} of ${total} ${noun} matching “${query}”`
    : `Showing ${range} of ${total} ${noun}`
}

export default function UserList() {
  const { users, total, status, error, query, page, totalPages, retry } = useUsers()
  const headingRef = useRef(null)
  const shownPage = useRef(page)

  // After moving between pages, put focus at the top of the new results so
  // keyboard and screen reader users don't stay stranded at the pager.
  useEffect(() => {
    if (shownPage.current !== page) {
      shownPage.current = page
      headingRef.current?.focus()
    }
  }, [page])

  const isEmpty = status === 'succeeded' && users.length === 0
  const pastLastPage = isEmpty && total > 0

  return (
    <section aria-labelledby="results-heading" className="space-y-6">
      <SearchBar />

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 id="results-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-bold focus:outline-none">
          People
        </h1>
        <p role="status" className="text-sm text-gray-700">
          {resultSummary({ status, total, page, query, count: users.length })}
        </p>
      </div>

      {status === 'failed' && <ErrorMessage message={error.message} onRetry={retry} />}

      {status === 'loading' && users.length === 0 && <Spinner label="Loading people" />}

      {pastLastPage && (
        <div className="py-8 text-center">
          <p className="text-lg text-gray-700">Page {page} is past the end of these results.</p>
          <Link
            to={{ pathname: '/', search: directorySearch({ query, page: totalPages }) }}
            className="mt-2 inline-block font-semibold text-blue-700 underline"
          >
            Go to the last page ({totalPages})
          </Link>
        </div>
      )}

      {isEmpty && !pastLastPage && <NoResults query={query} />}

      {status !== 'failed' && users.length > 0 && (
        <UserGrid users={users} busy={status === 'loading'} />
      )}

      {status !== 'failed' && totalPages > 1 && (
        <Pagination query={query} page={page} totalPages={totalPages} />
      )}
    </section>
  )
}
