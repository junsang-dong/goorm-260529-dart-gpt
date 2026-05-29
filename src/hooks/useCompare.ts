import { useCallback, useState } from 'react'
import type {
  CompareRequestCompany,
  CompareResponse,
} from '../types/financial'

export function useCompare() {
  const [data, setData] = useState<CompareResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const compare = useCallback(async (companies: CompareRequestCompany[]) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companies }),
      })

      const json = (await response.json()) as CompareResponse & { error?: string }

      if (!response.ok) {
        throw new Error(json.error ?? '비교 분석에 실패했습니다.')
      }

      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : '비교 분석에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return { data, loading, error, compare, reset }
}
