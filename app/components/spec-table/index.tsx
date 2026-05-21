function formatKey(key: string): string {
  return key.replace(/_/g, ' ')
}

export default function SpecTable({
  specs,
}: {
  specs: Record<string, unknown>
}) {
  const entries = Object.entries(specs).filter(
    ([, v]) => v !== null && v !== undefined && v !== '',
  )

  if (entries.length === 0) return null

  return (
    <table className="spec-table">
      <tbody>
        {entries.map(([key, value]) => (
          <tr key={key} className="spec-row">
            <th className="spec-label">{formatKey(key)}</th>
            <td className="spec-value">{String(value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
