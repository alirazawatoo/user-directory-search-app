import PropTypes from 'prop-types'

export default function UserInfo({ firstName, lastName, email, phone }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">
        {firstName} {lastName}
      </h2>
      <p className="mt-2 text-gray-600">{email}</p>
      <p className="text-gray-600">{phone}</p>
    </div>
  )
}

UserInfo.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired
} 