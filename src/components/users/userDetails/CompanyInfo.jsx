const termClass = 'text-xs font-bold uppercase tracking-[0.14em] text-muted'

const joinPresent = (parts) => parts.filter(Boolean).join(', ')

export default function CompanyInfo({ company }) {
  if (!company) {
    return (
      <section aria-labelledby="company-heading">
        <h2 id="company-heading" className="font-display text-xl font-bold">Company</h2>
        <p className="mt-4 text-muted">No company on record.</p>
      </section>
    )
  }

  const { name, department, title, address } = company
  const street = address?.address
  const region = joinPresent([address?.city, address?.state, address?.postalCode])

  return (
    <section aria-labelledby="company-heading">
      <h2 id="company-heading" className="font-display text-xl font-bold">Company</h2>
      <dl className="mt-4 space-y-3">
        {[
          ['Name', name],
          ['Department', department],
          ['Title', title],
        ]
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label}>
              <dt className={termClass}>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        {(street || region) && (
          <div>
            <dt className={termClass}>Office</dt>
            <dd>
              {street && <span className="block">{street}</span>}
              {region && <span className="block">{region}</span>}
            </dd>
          </div>
        )}
      </dl>
    </section>
  )
}
