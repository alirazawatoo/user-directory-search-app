import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="rounded-lg border border-rule bg-card p-8">
      <h1 className="font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">There is nothing at this address.</p>
      <Link to="/" className="mt-4 inline-block font-bold text-forest underline underline-offset-4">
        Go to the directory
      </Link>
    </div>
  )
}
