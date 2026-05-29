import type { ComparisonTableRow } from '../types/financial'

interface FinancialTableProps {
  rows: ComparisonTableRow[]
  companyNames: string[]
}

export function FinancialTable({ rows, companyNames }: FinancialTableProps) {
  return (
    <div className="overflow-x-auto border border-[var(--color-wsj-border)]">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--color-wsj-border)] bg-[var(--color-wsj-accent)] text-white">
            <th className="px-4 py-3 text-left font-bold">지표</th>
            {companyNames.map((name) => (
              <th key={name} className="px-4 py-3 text-right font-bold">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className={i % 2 === 0 ? 'bg-white/40' : 'bg-transparent'}
            >
              <td className="border-b border-[var(--color-wsj-border)] px-4 py-2.5 font-medium">
                {row.label}
              </td>
              {row.values.map((value, j) => (
                <td
                  key={`${row.label}-${j}`}
                  className="border-b border-[var(--color-wsj-border)] px-4 py-2.5 text-right"
                >
                  {value ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
