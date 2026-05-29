import type { CompareResponse } from '../types/financial'
import { SummaryCards } from './SummaryCards'
import { FinancialTable } from './FinancialTable'
import { CompareBarChart } from './CompareBarChart'
import { CompareRadarChart } from './CompareRadarChart'
import { GptCommentary } from './GptCommentary'

interface ComparisonDashboardProps {
  data: CompareResponse
}

export function ComparisonDashboard({ data }: ComparisonDashboardProps) {
  const companyNames = data.companies.map((c) => c.corpName)

  return (
    <section id="comparison-dashboard" className="animate-fade-in">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="border-b-2 border-[var(--color-wsj-text)] pb-2 text-2xl font-bold">
          Comparison Dashboard
        </h2>
        <p className="mt-2 text-sm text-[var(--color-wsj-muted)]">
          {companyNames.join(' vs ')} — 연결재무제표 기준
        </p>

        <div className="mt-8">
          <SummaryCards companies={data.companies} />
        </div>

        <div className="mt-10">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-wsj-accent)]">
            재무 비교표
          </h3>
          <FinancialTable rows={data.comparisonTable} companyNames={companyNames} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <CompareBarChart data={data.barChartData} companyNames={companyNames} />
          <CompareRadarChart data={data.radarChartData} companyNames={companyNames} />
        </div>

        <div className="mt-10">
          <GptCommentary analysis={data.analysis} />
        </div>
      </div>
    </section>
  )
}

export function ComparisonLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="border border-[var(--color-wsj-border)] bg-white/40 p-10 text-center">
        <div className="mx-auto h-2 w-48 skeleton-pulse bg-[var(--color-wsj-accent)]" />
        <p className="mt-6 text-lg font-bold text-[var(--color-wsj-accent)]">
          애널리스트 리포트 생성 중…
        </p>
        <p className="mt-2 text-sm text-[var(--color-wsj-muted)]">
          DART 재무 데이터 수집 및 AI 분석을 진행하고 있습니다.
        </p>
        <div className="mx-auto mt-8 grid max-w-md gap-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-4 skeleton-pulse bg-[var(--color-wsj-border)]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function ComparisonError({ message }: { message: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="border border-red-800/30 bg-red-50/50 p-6 text-red-900">
        <p className="font-bold">분석 오류</p>
        <p className="mt-2 text-sm">{message}</p>
      </div>
    </section>
  )
}
