import { PulseLoader } from 'react-spinners'

export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex h-40 items-center justify-center" aria-busy="true">
      <div className="text-center">
        <PulseLoader color="#1d4ed8" size={15} margin={5} aria-hidden="true" />
        <p className="mt-4 text-lg font-semibold text-gray-700">{label}…</p>
      </div>
    </div>
  )
}
