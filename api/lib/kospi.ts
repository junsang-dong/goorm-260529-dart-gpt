import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface KospiCompanyRow {
  corp_code: string
  stock_code: string
  corp_name: string
}

let cached: KospiCompanyRow[] | null = null

export function getKospiCompanies(): KospiCompanyRow[] {
  if (cached) return cached

  const path = join(__dirname, '..', 'data', 'kospi-companies.json')
  cached = JSON.parse(readFileSync(path, 'utf-8')) as KospiCompanyRow[]
  return cached
}
