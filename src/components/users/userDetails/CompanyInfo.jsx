import PropTypes from 'prop-types'

export default function CompanyInfo({ company }) {
  const { name, department, title, address } = company
  
  return (
    <div>
      <h3 className="text-xl font-semibold">Company Information</h3>
      <p className="mt-2 text-gray-700">{name}</p>
      <p className="text-gray-600">{department}</p>
      <p className="text-gray-600">{title}</p>
      <p className="mt-2 text-gray-600">
        {address.address}, {address.city}
      </p>
      <p className="text-gray-600">
        {address.state}, {address.postalCode}
      </p>
    </div>
  )
}

CompanyInfo.propTypes = {
  company: PropTypes.shape({
    name: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    address: PropTypes.shape({
      address: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      postalCode: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
} 