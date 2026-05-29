import type { CompanyFinancials } from '../types/financial'

function formatWon(value: number | null): string {
  if (value === null) return '—'
  const abs = Math.abs(value)
  if (abs >= 1_0000_0000_0000) return `${(value / 1_0000_0000_0000).toFixed(1)}조`
  if (abs >= 1_0000_0000) return `${(value / 1_0000_0000).toFixed(0)}억`
  return value.toLocaleString('ko-KR')
}

function formatPct(value: number | null): string {
  if (value === null) return '—'
  return `${value.toFixed(1)}%`
}

interface SummaryCardsProps {
  companies: CompanyFinancials[]
}

export function SummaryCards({ companies }: SummaryCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {companies.map((company) => (
        <article
          key={company.corpCode}
          className="border border-[var(--color-wsj-border)] bg-white/50 p-5"
        >
          <header className="border-b border-[var(--color-wsj-border)] pb-3">
            <h3 className="text-xl font-bold">{company.corpName}</h3>
            <p className="text-xs text-[var(--color-wsj-muted)]">
              {company.stockCode} · {company.fiscalYear}년 사업보고서
            </p>
          </header>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[var(--color-wsj-muted)]">매출</dt>
              <dd className="font-bold">{formatWon(company.metrics.revenue)}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-wsj-muted)]">영업이익</dt>
              <dd className="font-bold">{formatWon(company.metrics.operatingIncome)}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-wsj-muted)]">순이익</dt>
              <dd className="font-bold">{formatWon(company.metrics.netIncome)}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-wsj-muted)]">ROE</dt>
              <dd className="font-bold text-[var(--color-wsj-accent)]">
                {formatPct(company.ratios.roe)}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[var(--color-wsj-muted)]">부채비율</dt>
              <dd className="font-bold">{formatPct(company.ratios.debtRatio)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[var(--color-wsj-muted)]">매출 성장률</dt>
              <dd className="font-bold">{formatPct(company.ratios.revenueGrowth)}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  )
}
