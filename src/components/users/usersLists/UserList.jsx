import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useUsers } from '../../../hooks/useUsers'
import { directorySearch } from '../../../hooks/useUserSearchParams'
import { PAGE_SIZE } from '../../../services/UserService'
import ErrorMessage from '../../common/ErrorMessage'
import LoadingPlaceholder from '../../common/LoadingPlaceholder'
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
    <section aria-labelledby="results-heading" className="space-y-8">
      <SearchBar />

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule pb-3">
        <h1 id="results-heading" ref={headingRef} tabIndex={-1} className="font-display text-4xl font-bold focus:outline-none">
          People
        </h1>
        <p role="status" className="font-mono text-sm text-muted">
          {resultSummary({ status, total, page, query, count: users.length })}
        </p>
      </div>

      {status === 'failed' && <ErrorMessage message={error.message} onRetry={retry} />}

      {status === 'loading' && users.length === 0 && <LoadingPlaceholder label="Loading people" cards={6} />}

      {pastLastPage && (
        <div className="rounded-lg border border-dashed border-rule p-10 text-center">
          <p className="font-display text-2xl font-bold">Page {page} is past the end of these results.</p>
          <Link
            to={{ pathname: '/', search: directorySearch({ query, page: totalPages }) }}
            className="mt-3 inline-block font-bold text-forest underline underline-offset-4"
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
