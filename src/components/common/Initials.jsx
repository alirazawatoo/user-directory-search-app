export default function Initials({ firstName = '', lastName = '', size = 'md' }) {
  const letters = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  const sizing = size === 'lg' ? 'h-20 w-20 text-3xl' : 'h-12 w-12 text-lg'
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-md bg-forest font-display font-bold text-card ${sizing}`}
    >
      {letters}
    </span>
  )
}
