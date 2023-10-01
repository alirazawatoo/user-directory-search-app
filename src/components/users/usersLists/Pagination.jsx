import { Link } from 'react-router-dom'
import { directorySearch } from '../../../hooks/useUserSearchParams'

const base = 'min-w-28 rounded-md border-2 px-4 py-2 text-center font-bold'

function PageLink({ query, page, disabled, label, rel }) {
  if (disabled) {
    return (
      <span className={`${base} border-rule text-muted/60`} aria-disabled="true">
        {label}
      </span>
    )
  }
  return (
    <Link
      to={{ pathname: '/', search: directorySearch({ query, page }) }}
      rel={rel}
      className={`${base} border-forest text-forest hover:bg-forest hover:text-card`}
    >
      {label}
    </Link>
  )
}

export default function Pagination({ query, page, totalPages }) {
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4 border-t border-rule pt-6">
      <PageLink query={query} page={page - 1} disabled={page <= 1} label="Previous" rel="prev" />
      <p className="font-mono text-sm text-muted">
        Page {page} of {totalPages}
      </p>
      <PageLink query={query} page={page + 1} disabled={page >= totalPages} label="Next" rel="next" />
    </nav>
  )
}
