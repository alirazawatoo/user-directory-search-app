import { useEffect, useRef } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useUserDetails } from '../../../hooks/useUserDetails'
import Spinner from '../../common/Spinner'
import ErrorMessage from '../../common/ErrorMessage'
import UserInfo from './UserInfo'
import CompanyInfo from './CompanyInfo'

function BackLink() {
  const { state } = useLocation()
  // Return to the exact search and page the profile was opened from.
  return (
    <Link
      to={{ pathname: '/', search: state?.from ?? '' }}
      className="mb-6 inline-block font-semibold text-blue-700 underline-offset-4 hover:underline"
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
      <div className="rounded-lg bg-white p-8 shadow">
        <BackLink />
        <h1 className="text-2xl font-bold">Person not found</h1>
        <p className="mt-2 text-gray-700">Nobody in the directory has the ID “{id}”.</p>
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
    return <Spinner label="Loading profile" />
  }

  return (
    <article className="rounded-lg bg-white p-8 shadow" aria-labelledby="profile-heading">
      <title>{`${user.firstName} ${user.lastName} · User Directory`}</title>
      <BackLink />
      <div className="grid gap-6 md:grid-cols-2">
        <UserInfo user={user} headingRef={headingRef} />
        <CompanyInfo company={user.company} />
      </div>
    </article>
  )
}
