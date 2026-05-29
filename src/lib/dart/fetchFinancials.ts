import { dartGet, assertDartOk } from './client'
import type { DartAccountRow } from './accounts'
import {
  normalizeCompanyFinancials,
  type CompanyOverview,
} from './normalize'

const REPORT_CODE_ANNUAL = '11011'
const FS_DIV = 'CFS'

const FISCAL_YEARS = ['2025', '2024', '2023']

export interface DartCompanyResponse {
  corp_name?: string
  stock_code?: string
  induty_code?: string
  est_dt?: string
  corp_cls?: string
}

export async function fetchCompanyOverview(
  corpCode: string,
  apiKey: string,
): Promise<CompanyOverview> {
  const data = await dartGet<DartCompanyResponse>('company.json', {
    corp_code: corpCode.padStart(8, '0'),
  }, apiKey)

  assertDartOk(data.status, data.message)

  const info = data as unknown as DartCompanyResponse & {
    status: string
    message: string
  }
  return {
    corpName: info.corp_name ?? '',
    stockCode: (info.stock_code ?? '').trim(),
    industry: info.induty_code,
    estDate: info.est_dt,
  }
}

async function fetchStatementsForYear(
  corpCode: string,
  bsnsYear: string,
  apiKey: string,
): Promise<DartAccountRow[]> {
  const data = await dartGet<DartAccountRow>('fnlttSinglAcntAll.json', {
    corp_code: corpCode.padStart(8, '0'),
    bsns_year: bsnsYear,
    reprt_code: REPORT_CODE_ANNUAL,
    fs_div: FS_DIV,
  }, apiKey)

  if (data.status === '013') {
    return []
  }

  assertDartOk(data.status, data.message)
  return data.list ?? []
}

export async function fetchFinancialsForCompany(
  corpCode: string,
  stockCode: string,
  corpName: string,
  apiKey: string,
) {
  const [overview, ...yearResults] = await Promise.all([
    fetchCompanyOverview(corpCode, apiKey),
    ...FISCAL_YEARS.map((year) =>
      fetchStatementsForYear(corpCode, year, apiKey).then((rows) => ({
        year,
        rows,
      })),
    ),
  ])

  const valid = yearResults.find((r) => r.rows.length > 0)
  if (!valid) {
    throw new Error(
      `${corpName}: 최근 사업보고서 재무 데이터를 찾을 수 없습니다.`,
    )
  }

  return normalizeCompanyFinancials({
    corpCode: corpCode.padStart(8, '0'),
    stockCode: stockCode || overview.stockCode,
    corpName: corpName || overview.corpName,
    industry: overview.industry,
    estDate: overview.estDate,
    fiscalYear: Number(valid.year),
    rows: valid.rows,
  })
}
