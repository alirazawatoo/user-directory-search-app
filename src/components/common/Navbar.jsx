import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setSearchTerm } from '../../store/UserSlice'

export default function Navbar() {
  const dispatch = useDispatch()

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600">
              User Directory
            </h1>
          </Link>
          <input
            type="text"
            placeholder="Search users..."
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
        </div>
      </div>
    </nav>
  )
}