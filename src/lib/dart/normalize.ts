import { findAccountAmount, type DartAccountRow } from './accounts'
import type {
  CompanyFinancials,
  ComparisonTableRow,
  BarChartDatum,
  RadarChartDatum,
  FinancialMetrics,
  FinancialRatios,
  RadarScores,
} from '../../types/financial'

export interface CompanyOverview {
  corpName: string
  stockCode: string
  industry?: string
  estDate?: string
}

function safeRatio(numerator: number | null, denominator: number | null): number | null {
  if (numerator === null || denominator === null || denominator === 0) return null
  return (numerator / denominator) * 100
}

function growthRate(current: number | null, prior: number | null): number | null {
  if (current === null || prior === null || prior === 0) return null
  return ((current - prior) / Math.abs(prior)) * 100
}

function buildMetrics(rows: DartAccountRow[]): FinancialMetrics {
  return {
    revenue: findAccountAmount(rows, 'revenue'),
    operatingIncome: findAccountAmount(rows, 'operatingIncome'),
    netIncome: findAccountAmount(rows, 'netIncome'),
    totalAssets: findAccountAmount(rows, 'totalAssets'),
    totalLiabilities: findAccountAmount(rows, 'totalLiabilities'),
    equity: findAccountAmount(rows, 'equity'),
    operatingCashFlow: findAccountAmount(rows, 'operatingCashFlow'),
    investingCashFlow: findAccountAmount(rows, 'investingCashFlow'),
    currentAssets: findAccountAmount(rows, 'currentAssets'),
    currentLiabilities: findAccountAmount(rows, 'currentLiabilities'),
  }
}

function buildRatios(metrics: FinancialMetrics, rows: DartAccountRow[]): FinancialRatios {
  const priorRevenue = findAccountAmount(rows, 'revenue', 'prior')
  const priorOperating = findAccountAmount(rows, 'operatingIncome', 'prior')

  const ocf = metrics.operatingCashFlow
  const icf = metrics.investingCashFlow
  const fcf =
    ocf !== null && icf !== null ? ocf + icf : ocf

  return {
    roe: safeRatio(metrics.netIncome, metrics.equity),
    roa: safeRatio(metrics.netIncome, metrics.totalAssets),
    operatingMargin: safeRatio(metrics.operatingIncome, metrics.revenue),
    debtRatio: safeRatio(metrics.totalLiabilities, metrics.equity),
    currentRatio: safeRatio(metrics.currentAssets, metrics.currentLiabilities),
    revenueGrowth: growthRate(metrics.revenue, priorRevenue),
    operatingIncomeGrowth: growthRate(metrics.operatingIncome, priorOperating),
    fcf,
  }
}

function clampScore(value: number | null, min: number, max: number): number {
  if (value === null || !Number.isFinite(value)) return 50
  const clamped = Math.max(min, Math.min(max, value))
  return Math.round(((clamped - min) / (max - min)) * 100)
}

export function computeRadarScores(ratios: FinancialRatios, metrics: FinancialMetrics): RadarScores {
  const profitability = Math.round(
    (clampScore(ratios.roe, -5, 25) +
      clampScore(ratios.operatingMargin, -5, 30) +
      clampScore(ratios.roa, -2, 15)) /
      3,
  )

  const growth = Math.round(
    (clampScore(ratios.revenueGrowth, -20, 40) +
      clampScore(ratios.operatingIncomeGrowth, -30, 50)) /
      2,
  )

  const debtScore = ratios.debtRatio !== null ? 100 - clampScore(ratios.debtRatio, 50, 250) : 50
  const currentScore = clampScore(ratios.currentRatio, 80, 250)
  const stability = Math.round((debtScore + currentScore) / 2)

  const cashScore =
    metrics.operatingCashFlow !== null && metrics.operatingCashFlow > 0 ? 75 : 35
  const fcfBonus = ratios.fcf !== null && ratios.fcf > 0 ? 15 : 0
  const cashFlow = Math.min(100, cashScore + fcfBonus)

  return { profitability, growth, stability, cashFlow }
}

export function normalizeCompanyFinancials(input: {
  corpCode: string
  stockCode: string
  corpName: string
  industry?: string
  estDate?: string
  fiscalYear: number
  rows: DartAccountRow[]
}): CompanyFinancials {
  const metrics = buildMetrics(input.rows)
  const ratios = buildRatios(metrics, input.rows)
  const radarScores = computeRadarScores(ratios, metrics)

  return {
    corpCode: input.corpCode,
    stockCode: input.stockCode,
    corpName: input.corpName,
    industry: input.industry,
    estDate: input.estDate,
    fiscalYear: input.fiscalYear,
    metrics,
    ratios,
    radarScores,
  }
}

function formatWon(value: number | null): string {
  if (value === null) return '—'
  const abs = Math.abs(value)
  if (abs >= 1_0000_0000_0000) {
    return `${(value / 1_0000_0000_0000).toFixed(1)}조`
  }
  if (abs >= 1_0000_0000) {
    return `${(value / 1_0000_0000).toFixed(0)}억`
  }
  return value.toLocaleString('ko-KR')
}

function formatPercent(value: number | null): string {
  if (value === null) return '—'
  return `${value.toFixed(1)}%`
}

export function buildComparisonPayload(companies: CompanyFinancials[]) {
  const names = companies.map((c) => c.corpName)

  const comparisonTable: ComparisonTableRow[] = [
    {
      label: '매출액',
      values: companies.map((c) => formatWon(c.metrics.revenue)),
    },
    {
      label: '영업이익',
      values: companies.map((c) => formatWon(c.metrics.operatingIncome)),
    },
    {
      label: '당기순이익',
      values: companies.map((c) => formatWon(c.metrics.netIncome)),
    },
    {
      label: '총자산',
      values: companies.map((c) => formatWon(c.metrics.totalAssets)),
    },
    {
      label: '총부채',
      values: companies.map((c) => formatWon(c.metrics.totalLiabilities)),
    },
    {
      label: '자본총계',
      values: companies.map((c) => formatWon(c.metrics.equity)),
    },
    {
      label: 'ROE',
      values: companies.map((c) => formatPercent(c.ratios.roe)),
    },
    {
      label: 'ROA',
      values: companies.map((c) => formatPercent(c.ratios.roa)),
    },
    {
      label: '영업이익률',
      values: companies.map((c) => formatPercent(c.ratios.operatingMargin)),
    },
    {
      label: '부채비율',
      values: companies.map((c) => formatPercent(c.ratios.debtRatio)),
    },
    {
      label: '매출 성장률',
      values: companies.map((c) => formatPercent(c.ratios.revenueGrowth)),
    },
    {
      label: '영업현금흐름',
      values: companies.map((c) => formatWon(c.metrics.operatingCashFlow)),
    },
  ]

  const barChartData: BarChartDatum[] = [
  { name: '매출', ...Object.fromEntries(companies.map((c) => [c.corpName, c.metrics.revenue ?? 0])) },
  {
    name: '영업이익',
    ...Object.fromEntries(
      companies.map((c) => [c.corpName, c.metrics.operatingIncome ?? 0]),
    ),
  },
  {
    name: '순이익',
    ...Object.fromEntries(companies.map((c) => [c.corpName, c.metrics.netIncome ?? 0])),
  },
  ]

  const radarSubjects = [
    { key: 'profitability', label: '수익성' },
    { key: 'growth', label: '성장성' },
    { key: 'stability', label: '안정성' },
    { key: 'cashFlow', label: '현금흐름' },
  ] as const

  const radarChartData: RadarChartDatum[] = radarSubjects.map(({ key, label }) => {
    const entry: RadarChartDatum = { subject: label }
    for (const company of companies) {
      entry[company.corpName] = company.radarScores[key]
    }
    return entry
  })

  return { comparisonTable, barChartData, radarChartData, companyNames: names }
}
