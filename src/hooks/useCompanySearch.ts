import { useCallback, useEffect, useState } from 'react'
import type { KospiCompany } from '../types/financial'

export function useCompanySearch(query: string) {
  const [results, setResults] = useState<KospiCompany[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({ q })
      const response = await fetch(`/api/companies/search?${params}`)
      if (!response.ok) throw new Error('검색 실패')
      const data = (await response.json()) as { results: KospiCompany[] }
      setResults(data.results)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      void search(query)
    }, 250)
    return () => clearTimeout(timer)
  }, [query, search])

  return { results, loading }
}
