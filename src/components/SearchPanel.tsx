import { useState } from 'react'
import type { KospiCompany } from '../types/financial'
import { useCompanySearch } from '../hooks/useCompanySearch'

interface SearchPanelProps {
  selected: KospiCompany[]
  onSelect: (company: KospiCompany) => void
  onRemove: (corpCode: string) => void
  onCompare: () => void
  loading: boolean
}

export function SearchPanel({
  selected,
  onSelect,
  onRemove,
  onCompare,
  loading,
}: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const { results, loading: searchLoading } = useCompanySearch(query)

  const canCompare = selected.length === 2 && !loading

  return (
    <section className="border-b border-[var(--color-wsj-border)] bg-white/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="text-lg font-bold text-[var(--color-wsj-accent)]">기업 선택</h2>
        <p className="mt-1 text-sm text-[var(--color-wsj-muted)]">
          KOSPI 상장기업 2개를 선택한 뒤 비교를 시작하세요.
        </p>

        <div className="relative mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="기업명 또는 종목코드 검색 (예: 삼성전자, 005930)"
            className="w-full border border-[var(--color-wsj-border)] bg-[var(--color-wsj-bg)] px-4 py-3 text-base outline-none focus:border-[var(--color-wsj-accent)]"
            disabled={selected.length >= 2}
          />
          {query && selected.length < 2 && (
            <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto border border-[var(--color-wsj-border)] bg-[var(--color-wsj-bg)] shadow-md">
              {searchLoading && (
                <li className="px-4 py-3 text-sm text-[var(--color-wsj-muted)]">검색 중…</li>
              )}
              {!searchLoading && results.length === 0 && (
                <li className="px-4 py-3 text-sm text-[var(--color-wsj-muted)]">
                  검색 결과가 없습니다.
                </li>
              )}
              {results.map((company) => {
                const isSelected = selected.some((s) => s.corp_code === company.corp_code)
                return (
                  <li key={company.corp_code}>
                    <button
                      type="button"
                      disabled={isSelected}
                      onClick={() => {
                        onSelect(company)
                        setQuery('')
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-white/60 disabled:opacity-50"
                    >
                      <span className="font-medium">{company.corp_name}</span>
                      <span className="text-[var(--color-wsj-muted)]">{company.stock_code}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selected.map((company) => (
              <span
                key={company.corp_code}
                className="inline-flex items-center gap-2 border border-[var(--color-wsj-accent)] bg-[var(--color-wsj-accent)] px-3 py-1.5 text-sm text-white"
              >
                {company.corp_name}
                <button
                  type="button"
                  onClick={() => onRemove(company.corp_code)}
                  className="opacity-80 hover:opacity-100"
                  aria-label={`${company.corp_name} 제거`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onCompare}
          disabled={!canCompare}
          className="mt-6 w-full border-2 border-[var(--color-wsj-accent)] bg-[var(--color-wsj-accent)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-transparent hover:text-[var(--color-wsj-accent)] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          {loading ? '분석 중…' : '비교 시작'}
        </button>
      </div>
    </section>
  )
}
