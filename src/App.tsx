import { useCallback, useRef, useState } from 'react'
import { Header } from './components/Header'
import { SearchPanel } from './components/SearchPanel'
import {
  ComparisonDashboard,
  ComparisonError,
  ComparisonLoading,
} from './components/ComparisonDashboard'
import { useCompare } from './hooks/useCompare'
import type { KospiCompany } from './types/financial'

export default function App() {
  const [selected, setSelected] = useState<KospiCompany[]>([])
  const dashboardRef = useRef<HTMLDivElement>(null)
  const { data, loading, error, compare } = useCompare()

  const handleSelect = useCallback((company: KospiCompany) => {
    setSelected((prev) => {
      if (prev.length >= 2) return prev
      if (prev.some((c) => c.corp_code === company.corp_code)) return prev
      return [...prev, company]
    })
  }, [])

  const handleRemove = useCallback((corpCode: string) => {
    setSelected((prev) => prev.filter((c) => c.corp_code !== corpCode))
  }, [])

  const handleCompare = useCallback(async () => {
    if (selected.length !== 2) return

    await compare(
      selected.map((c) => ({
        corpCode: c.corp_code,
        stockCode: c.stock_code,
        corpName: c.corp_name,
      })),
    )

    requestAnimationFrame(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [selected, compare])

  return (
    <div className="min-h-dvh">
      <Header />
      <SearchPanel
        selected={selected}
        onSelect={handleSelect}
        onRemove={handleRemove}
        onCompare={() => void handleCompare()}
        loading={loading}
      />

      <div ref={dashboardRef}>
        {loading && <ComparisonLoading />}
        {error && !loading && <ComparisonError message={error} />}
        {data && !loading && <ComparisonDashboard data={data} />}
      </div>

      <footer className="border-t border-[var(--color-wsj-border)] py-8 text-center text-xs text-[var(--color-wsj-muted)]">
        데이터 출처: DART Open API · 분석: OpenAI GPT
        <br />
        본 서비스는 투자 권유가 아닌 학습·참고용 정보입니다.
      </footer>
    </div>
  )
}
