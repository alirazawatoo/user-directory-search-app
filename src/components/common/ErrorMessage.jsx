export default function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-lg border-l-4 border-danger bg-danger-soft p-6">
      <p className="font-bold text-danger">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md bg-danger px-4 py-2 font-bold text-card hover:bg-ink"
        >
          Try again
        </button>
      )}
    </div>
  )
}
