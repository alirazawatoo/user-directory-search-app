import { useParams, Link } from 'react-router-dom'
import { useUserDetails } from '../../../hooks/useUserDetails'
import Spinner from '../../common/Spinner'
import ErrorMessage from '../../common/ErrorMessage'
import UserInfo from './UserInfo'
import CompanyInfo from './CompanyInfo'

export default function UserDetails() {
  const { id } = useParams()
  const { user, status, error } = useUserDetails(id)

  if (status === 'loading' || !user) {
    return <Spinner />
  }

  if (status === 'failed') {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow">
      <Link
        to="/"
        className="mb-6 inline-block text-blue-500 hover:text-blue-700"
      >
        ← Back to Users
      </Link>
      
      <div className="grid gap-6 md:grid-cols-2">
        <UserInfo 
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          phone={user.phone}
        />
        <CompanyInfo company={user.company} />
      </div>
    </div>
  )
}