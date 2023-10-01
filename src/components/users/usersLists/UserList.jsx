import NoResults from './NoResults'
import Spinner from '../../common/Spinner'
import { useUsers } from '../../../hooks/useUsers'
import UserGrid from './UserGrid'
import ErrorMessage from '../../common/ErrorMessage'

export default function UserList() {
  const {
    filteredUsers,
    status,
    error,
    searchTerm,
    lastUserElementRef
  } = useUsers()

  if (status === 'failed') {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-4">
      {filteredUsers.length === 0 && searchTerm ? (
        <NoResults searchTerm={searchTerm} />
      ) : (
        <UserGrid 
          users={filteredUsers}
          lastUserElementRef={lastUserElementRef}
        />
      )}
      
      {status === 'loading' && (
        <div className="py-4">
          <Spinner />
        </div>
      )}
    </div>
  )
}