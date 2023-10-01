import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="border-b-4 border-forest bg-card">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight text-forest-deep">
          UserFinder
        </Link>
        <p className="hidden text-sm uppercase tracking-[0.18em] text-muted sm:block">People directory</p>
      </div>
    </header>
  )
}
