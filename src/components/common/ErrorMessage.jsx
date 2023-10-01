export default function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-6 text-center">
      <p className="font-semibold text-red-800">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
        >
          Try again
        </button>
      )}
    </div>
  )
}
