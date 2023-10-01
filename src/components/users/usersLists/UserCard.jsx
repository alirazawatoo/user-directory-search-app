import { Link } from 'react-router-dom'
export default function UserCard({ user }) {
  return (
    <Link
      to={`/user/${user.id}`}
      className="block rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
    >
      <h2 className="text-xl font-semibold">
        {user.firstName} {user.lastName}
      </h2>
      <p className="mt-2 text-gray-600">{user.email}</p>
      <p className="text-gray-600">{user.phone}</p>
      <p className="mt-2 text-gray-700">{user.company.name}</p>
    </Link>
  )
}
