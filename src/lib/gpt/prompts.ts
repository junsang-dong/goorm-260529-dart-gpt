import type { CompanyFinancials } from '../../types/financial'

function formatNumber(n: number | null, suffix = ''): string {
  if (n === null) return 'N/A'
  return `${n.toLocaleString('ko-KR')}${suffix}`
}

export function buildSystemPrompt(): string {
  return `당신은 Wall Street Journal의 수석 애널리스트입니다.
입력된 KOSPI 상장기업들의 수익성, 성장성, 안정성, 현금흐름을 분석하세요.
한국어로 전문적이고 간결한 투자 분석 톤을 유지하세요.
각 기업별로 강점, 약점, 투자 시 고려사항을 구체적으로 제시하세요.
두 기업을 직접 비교하는 내러티브를 포함하세요.
투자 권유(매수/매도)는 하지 말고, 분석적 관점만 제시하세요.`
}

export function buildUserPrompt(companies: CompanyFinancials[]): string {
  const payload = companies.map((c) => ({
    name: c.corpName,
    stockCode: c.stockCode,
    fiscalYear: c.fiscalYear,
    metrics: {
      revenue: c.metrics.revenue,
      operatingIncome: c.metrics.operatingIncome,
      netIncome: c.metrics.netIncome,
      totalAssets: c.metrics.totalAssets,
      totalLiabilities: c.metrics.totalLiabilities,
      equity: c.metrics.equity,
      operatingCashFlow: c.metrics.operatingCashFlow,
    },
    ratios: {
      roe: c.ratios.roe,
      roa: c.ratios.roa,
      operatingMargin: c.ratios.operatingMargin,
      debtRatio: c.ratios.debtRatio,
      revenueGrowth: c.ratios.revenueGrowth,
      operatingIncomeGrowth: c.ratios.operatingIncomeGrowth,
      fcf: c.ratios.fcf,
    },
    radarScores: c.radarScores,
  }))

  return `다음 ${companies.length}개 KOSPI 기업의 재무 데이터를 비교 분석하세요.

데이터 (단위: 원, 비율은 %):
${JSON.stringify(payload, null, 2)}

다음 JSON 형식으로만 응답하세요:
{
  "summary": "2~3문장 Executive Summary",
  "companies": [
    {
      "name": "기업명",
      "strengths": ["강점1", "강점2"],
      "weaknesses": ["약점1", "약점2"],
      "considerations": ["고려사항1", "고려사항2"]
    }
  ],
  "comparison": "두 기업 직접 비교 내러티브 (3~5문장)",
  "investmentConsiderations": ["투자 시 고려사항1", "투자 시 고려사항2", "투자 시 고려사항3"]
}`
}

export function formatMetricsForDisplay(c: CompanyFinancials): string {
  return [
    `매출: ${formatNumber(c.metrics.revenue)}`,
    `영업이익: ${formatNumber(c.metrics.operatingIncome)}`,
    `ROE: ${formatNumber(c.ratios.roe, '%')}`,
    `부채비율: ${formatNumber(c.ratios.debtRatio, '%')}`,
  ].join(' | ')
}
