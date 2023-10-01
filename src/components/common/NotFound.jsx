import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="rounded-lg bg-white p-8 shadow">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-gray-700">There is nothing at this address.</p>
      <Link to="/" className="mt-4 inline-block font-semibold text-blue-700 underline">
        Go to the directory
      </Link>
    </div>
  )
}
