import { useEffect, useRef } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useUserDetails } from '../../../hooks/useUserDetails'
import LoadingPlaceholder from '../../common/LoadingPlaceholder'
import ErrorMessage from '../../common/ErrorMessage'
import Initials from '../../common/Initials'
import UserInfo from './UserInfo'
import CompanyInfo from './CompanyInfo'

function BackLink() {
  const { state } = useLocation()
  // Return to the exact search and page the profile was opened from.
  return (
    <Link
      to={{ pathname: '/', search: state?.from ?? '' }}
      className="mb-6 inline-block font-bold text-forest underline-offset-4 hover:underline"
    >
      ← Back to people
    </Link>
  )
}

export default function UserDetails() {
  const { id } = useParams()
  const { user, status, error, retry } = useUserDetails(id)
  const headingRef = useRef(null)

  useEffect(() => {
    if (user) headingRef.current?.focus()
  }, [user])

  if (status === 'failed' && error?.code === 'not_found') {
    return (
      <div>
        <BackLink />
        <div className="rounded-lg border border-dashed border-rule p-10">
          <h1 className="font-display text-3xl font-bold">Person not found</h1>
          <p className="mt-2 text-muted">Nobody in the directory has the ID “{id}”.</p>
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div>
        <BackLink />
        <ErrorMessage message={error?.message ?? 'Something went wrong.'} onRetry={retry} />
      </div>
    )
  }

  if (!user) {
    return <LoadingPlaceholder label="Loading profile" />
  }

  return (
    <div>
      <title>{`${user.firstName} ${user.lastName} · UserFinder`}</title>
      <BackLink />
      <article
        aria-labelledby="profile-heading"
        className="overflow-hidden rounded-lg border border-rule bg-card shadow-[0_2px_0_var(--color-rule)]"
      >
        <div className="flex items-center gap-5 border-b border-rule bg-moss px-6 py-6 sm:px-8">
          <Initials firstName={user.firstName} lastName={user.lastName} size="lg" />
          <div className="min-w-0">
            <h1
              id="profile-heading"
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-3xl font-bold leading-tight focus:outline-none sm:text-4xl"
            >
              {user.firstName} {user.lastName}
            </h1>
            {user.company?.title && (
              <p className="mt-1 text-sm uppercase tracking-wider text-clay">{user.company.title}</p>
            )}
          </div>
        </div>
        <div className="grid gap-8 px-6 py-8 sm:px-8 md:grid-cols-2">
          <UserInfo user={user} />
          <CompanyInfo company={user.company} />
        </div>
      </article>
    </div>
  )
}
