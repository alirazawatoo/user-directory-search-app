export default function UserInfo({ user, headingRef }) {
  return (
    <div>
      <h1 id="profile-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-bold focus:outline-none">
        {user.firstName} {user.lastName}
      </h1>
      <dl className="mt-4 space-y-2">
        <div>
          <dt className="text-sm font-semibold text-gray-600">Email</dt>
          <dd>
            {user.email ? (
              <a href={`mailto:${user.email}`} className="break-all text-blue-700 underline">
                {user.email}
              </a>
            ) : (
              'Not listed'
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-gray-600">Phone</dt>
          <dd>{user.phone || 'Not listed'}</dd>
        </div>
      </dl>
    </div>
  )
}
