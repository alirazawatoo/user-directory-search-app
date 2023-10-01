import { Link, useLocation } from 'react-router-dom'

export default function UserCard({ user }) {
  const { search } = useLocation()
  const { company } = user

  return (
    <article className="relative h-full rounded-lg bg-white p-6 shadow transition-shadow focus-within:ring-2 focus-within:ring-blue-600 hover:shadow-lg">
      <h2 className="text-xl font-semibold">
        {/* The stretched link makes the whole card clickable while the link's
            accessible name stays just the person's name. */}
        <Link to={`/user/${user.id}`} state={{ from: search }} className="after:absolute after:inset-0 focus:outline-none">
          {user.firstName} {user.lastName}
        </Link>
      </h2>
      {company?.name && <p className="mt-1 text-gray-700">{company.name}</p>}
      <p className="mt-2 break-all text-gray-600">{user.email}</p>
      <p className="text-gray-600">{user.phone}</p>
    </article>
  )
}
