// A placeholder shaped like the content it stands in for, announced once.
export default function LoadingPlaceholder({ label = 'Loading', cards = 0 }) {
  return (
    <div aria-busy="true">
      <p className="sr-only">{label}…</p>
      {cards > 0 ? (
        <ul aria-hidden="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }, (_, index) => (
            <li key={index} className="h-40 animate-pulse rounded-lg border border-rule bg-card" />
          ))}
        </ul>
      ) : (
        <div aria-hidden="true" className="h-64 animate-pulse rounded-lg border border-rule bg-card" />
      )}
    </div>
  )
}
