import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-700">
          User Directory
        </Link>
      </div>
    </header>
  )
}
