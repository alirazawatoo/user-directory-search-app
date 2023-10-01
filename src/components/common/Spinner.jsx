import { PulseLoader } from 'react-spinners'

export default function Spinner() {
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="text-center">
        <PulseLoader color="#3B82F6" size={15} margin={5} />
        <p className="mt-4 text-lg font-semibold text-gray-700">Loading users...</p>
      </div>
    </div>
  )
}
