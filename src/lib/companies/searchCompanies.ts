import type { KospiCompany } from '../../types/financial'

let cachedList: KospiCompany[] | null = null

export async function loadKospiCompanies(): Promise<KospiCompany[]> {
  if (cachedList) return cachedList

  const response = await fetch('/data/kospi-companies.json')
  if (!response.ok) {
    throw new Error('Failed to load company list')
  }

  cachedList = (await response.json()) as KospiCompany[]
  return cachedList
}

export function searchCompanies(list: KospiCompany[], query: string, limit = 12): KospiCompany[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return list
    .filter(
      (c) =>
        c.corp_name.toLowerCase().includes(q) ||
        c.stock_code.includes(q) ||
        c.corp_code.includes(q),
    )
    .slice(0, limit)
}
