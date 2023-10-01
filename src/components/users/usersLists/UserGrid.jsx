import UserCard from './UserCard'

export default function UserGrid({ users, busy }) {
  return (
    <ul
      aria-label="People"
      aria-busy={busy}
      className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${busy ? 'opacity-60 transition-opacity' : ''}`}
    >
      {users.map((user) => (
        <li key={user.id}>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  )
}
