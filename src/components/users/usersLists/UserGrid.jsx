import UserCard from './UserCard'

export default function UserGrid({ users, lastUserElementRef }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user, index) => (
        <div
          key={`${user.id}-${index}`}
          ref={index === users.length - 1 ? lastUserElementRef : null}
        >
          <UserCard user={user} />
        </div>
      ))}
    </div>
  )
}
