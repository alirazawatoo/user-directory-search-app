export default function ErrorMessage({ message }) {
  return (
    <div
      className="text-center text-red-500"
      role="alert"
      aria-live="assertive"
    >
      Error: {message}
    </div>
  )
}
