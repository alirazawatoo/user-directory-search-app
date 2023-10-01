const termClass = 'text-xs font-bold uppercase tracking-[0.14em] text-muted'

export default function UserInfo({ user }) {
  return (
    <section aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="font-display text-xl font-bold">Contact</h2>
      <dl className="mt-4 space-y-3">
        <div>
          <dt className={termClass}>Email</dt>
          <dd className="font-mono">
            {user.email ? (
              <a href={`mailto:${user.email}`} className="break-all text-forest underline underline-offset-4">
                {user.email}
              </a>
            ) : (
              'Not listed'
            )}
          </dd>
        </div>
        <div>
          <dt className={termClass}>Phone</dt>
          <dd className="font-mono">{user.phone || 'Not listed'}</dd>
        </div>
      </dl>
    </section>
  )
}
