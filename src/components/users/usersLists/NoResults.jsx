import PropTypes from 'prop-types'

export default function NoResults({ searchTerm }) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500 text-lg">
        No users found matching `{searchTerm}` 🔍
      </p>
      <p className="text-gray-400 mt-2">
        Try adjusting your search or check the spelling
      </p>
    </div>
  )
}

NoResults.propTypes = {
  searchTerm: PropTypes.string.isRequired
} 