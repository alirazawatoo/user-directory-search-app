import { Link, useLocation } from 'react-router-dom'
import Initials from '../../common/Initials'

export default function UserCard({ user }) {
  const { search } = useLocation()
  const { company } = user

  return (
    <article className="relative flex h-full gap-4 rounded-lg border border-rule bg-card p-5 shadow-[0_1px_0_var(--color-rule)] transition hover:-translate-y-0.5 hover:border-forest focus-within:border-forest">
      <Initials firstName={user.firstName} lastName={user.lastName} />
      <div className="min-w-0">
        <h2 className="font-display text-xl font-bold leading-tight">
          {/* The stretched link makes the whole card clickable while the link's
              accessible name stays just the person's name. */}
          <Link
            to={`/user/${user.id}`}
            state={{ from: search }}
            className="after:absolute after:inset-0 after:rounded-lg hover:text-forest focus:outline-none focus-visible:after:outline-3 focus-visible:after:outline-forest"
          >
            {user.firstName} {user.lastName}
          </Link>
        </h2>
        {company?.name && (
          <p className="mt-1 text-sm uppercase tracking-wider text-clay">
            {company.title ? `${company.title}, ` : ''}
            {company.name}
          </p>
        )}
        <p className="mt-3 break-all font-mono text-sm text-muted">{user.email}</p>
        <p className="font-mono text-sm text-muted">{user.phone}</p>
      </div>
    </article>
  )
}
