import { Link } from 'react-router-dom'
import { directorySearch } from '../../../hooks/useUserSearchParams'

const linkClass = 'rounded-lg border border-gray-400 px-4 py-2 font-semibold hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600'
const disabledClass = 'rounded-lg border border-gray-300 px-4 py-2 text-gray-400'

function PageLink({ query, page, disabled, label, rel }) {
  if (disabled) {
    return (
      <span className={disabledClass} aria-disabled="true">
        {label}
      </span>
    )
  }
  return (
    <Link to={{ pathname: '/', search: directorySearch({ query, page }) }} rel={rel} className={linkClass}>
      {label}
    </Link>
  )
}

export default function Pagination({ query, page, totalPages }) {
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4">
      <PageLink query={query} page={page - 1} disabled={page <= 1} label="Previous" rel="prev" />
      <p className="text-sm text-gray-700">
        Page {page} of {totalPages}
      </p>
      <PageLink query={query} page={page + 1} disabled={page >= totalPages} label="Next" rel="next" />
    </nav>
  )
}
