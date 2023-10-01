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
