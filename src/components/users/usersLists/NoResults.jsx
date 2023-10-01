import { useUserSearchParams } from '../../../hooks/useUserSearchParams'

export default function NoResults({ query }) {
  const { setQuery } = useUserSearchParams()

  if (!query) {
    return <p className="rounded-lg border border-dashed border-rule p-10 text-center text-muted">The directory has no people yet.</p>
  }

  return (
    <div className="rounded-lg border border-dashed border-rule p-10 text-center">
      <p className="font-display text-2xl font-bold">No one matches “{query}”.</p>
      <p className="mt-2 text-muted">Check the spelling, or try part of a name.</p>
      <button
        type="button"
        onClick={() => setQuery('')}
        className="mt-5 rounded-md border-2 border-forest px-4 py-2 font-bold text-forest hover:bg-forest hover:text-card"
      >
        Clear search
      </button>
    </div>
  )
}
