import { useUserSearchParams } from '../../../hooks/useUserSearchParams'

export default function NoResults({ query }) {
  const { setQuery } = useUserSearchParams()

  if (!query) {
    return <p className="py-8 text-center text-lg text-gray-700">The directory has no people yet.</p>
  }

  return (
    <div className="py-8 text-center">
      <p className="text-lg text-gray-700">No one matches “{query}”.</p>
      <p className="mt-2 text-gray-600">Check the spelling, or search by first name, last name or email.</p>
      <button
        type="button"
        onClick={() => setQuery('')}
        className="mt-4 rounded-lg border border-gray-400 px-4 py-2 font-semibold hover:bg-gray-200"
      >
        Clear search
      </button>
    </div>
  )
}
