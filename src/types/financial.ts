export interface KospiCompany {
  corp_code: string
  stock_code: string
  corp_name: string
}

export interface FinancialMetrics {
  revenue: number | null
  operatingIncome: number | null
  netIncome: number | null
  totalAssets: number | null
  totalLiabilities: number | null
  equity: number | null
  operatingCashFlow: number | null
  investingCashFlow: number | null
  currentAssets: number | null
  currentLiabilities: number | null
}

export interface FinancialRatios {
  roe: number | null
  roa: number | null
  operatingMargin: number | null
  debtRatio: number | null
  currentRatio: number | null
  revenueGrowth: number | null
  operatingIncomeGrowth: number | null
  fcf: number | null
}

export interface RadarScores {
  profitability: number
  growth: number
  stability: number
  cashFlow: number
}

export interface CompanyFinancials {
  corpCode: string
  stockCode: string
  corpName: string
  industry?: string
  estDate?: string
  fiscalYear: number
  metrics: FinancialMetrics
  ratios: FinancialRatios
  radarScores: RadarScores
}

export interface CompanyAnalysis {
  name: string
  strengths: string[]
  weaknesses: string[]
  considerations: string[]
}

export interface GptAnalysis {
  summary: string
  companies: CompanyAnalysis[]
  comparison: string
  investmentConsiderations: string[]
}

export interface ComparisonTableRow {
  label: string
  values: (string | number | null)[]
}

export interface BarChartDatum {
  name: string
  [key: string]: string | number
}

export interface RadarChartDatum {
  subject: string
  [companyName: string]: string | number
}

export interface CompareResponse {
  companies: CompanyFinancials[]
  comparisonTable: ComparisonTableRow[]
  barChartData: BarChartDatum[]
  radarChartData: RadarChartDatum[]
  analysis: GptAnalysis
}

export interface CompareRequestCompany {
  corpCode: string
  stockCode: string
  corpName: string
}
