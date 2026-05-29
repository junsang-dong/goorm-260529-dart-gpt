import type { KospiCompanyRow } from './kospi'

export function searchCompanies(
  list: KospiCompanyRow[],
  query: string,
  limit = 12,
): KospiCompanyRow[] {
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
