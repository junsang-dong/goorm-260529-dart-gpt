export const ACCOUNT_IDS = {
  revenue: ['ifrs-full_Revenue', 'dart_TotalRevenue'],
  operatingIncome: [
    'dart_OperatingIncomeLoss',
    'dart_OperatingIncomeProfitLoss',
    'ifrs-full_ProfitLossFromOperatingActivities',
  ],
  netIncome: [
    'ifrs-full_ProfitLoss',
    'ifrs-full_ProfitLossAttributableToOwnersOfParent',
  ],
  totalAssets: ['ifrs-full_Assets'],
  totalLiabilities: ['ifrs-full_Liabilities'],
  equity: ['ifrs-full_Equity'],
  currentAssets: ['ifrs-full_CurrentAssets'],
  currentLiabilities: ['ifrs-full_CurrentLiabilities'],
  operatingCashFlow: [
    'ifrs-full_CashFlowsFromUsedInOperatingActivities',
    'dart_CashFlowsFromUsedInOperatingActivities',
  ],
  investingCashFlow: [
    'ifrs-full_CashFlowsFromUsedInInvestingActivities',
    'dart_CashFlowsFromUsedInInvestingActivities',
  ],
} as const

export type AccountKey = keyof typeof ACCOUNT_IDS

const NAME_KEYWORDS: Record<AccountKey, string[]> = {
  revenue: ['매출', '수익(매출)'],
  operatingIncome: ['영업이익', '영업손실'],
  netIncome: ['당기순이익', '분기순이익', '연결당기순이익'],
  totalAssets: ['자산총계', '총자산'],
  totalLiabilities: ['부채총계', '총부채'],
  equity: ['자본총계', '자본 총계'],
  currentAssets: ['유동자산'],
  currentLiabilities: ['유동부채'],
  operatingCashFlow: ['영업활동현금흐름', '영업활동으로 인한 현금흐름'],
  investingCashFlow: ['투자활동현금흐름', '투자활동으로 인한 현금흐름'],
}

export interface DartAccountRow {
  account_id?: string
  account_nm?: string
  thstrm_amount?: string
  frmtrm_amount?: string
  sj_div?: string
}

export function parseAmount(value?: string): number | null {
  if (!value || value === '-' || value.trim() === '') return null
  const cleaned = value.replace(/,/g, '').replace(/\s/g, '')
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : null
}

export function findAccountAmount(
  rows: DartAccountRow[],
  key: AccountKey,
  period: 'current' | 'prior' = 'current',
): number | null {
  const field = period === 'current' ? 'thstrm_amount' : 'frmtrm_amount'
  const ids = ACCOUNT_IDS[key]

  for (const id of ids) {
    const match = rows.find((r) => r.account_id === id)
    const amount = parseAmount(match?.[field])
    if (amount !== null) return amount
  }

  const keywords = NAME_KEYWORDS[key]
  for (const row of rows) {
    const name = row.account_nm ?? ''
    if (keywords.some((kw) => name.includes(kw))) {
      const amount = parseAmount(row[field])
      if (amount !== null) return amount
    }
  }

  return null
}
