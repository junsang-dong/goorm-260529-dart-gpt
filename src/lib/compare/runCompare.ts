import { fetchFinancialsForCompany } from '../dart/fetchFinancials'
import { buildComparisonPayload } from '../dart/normalize'
import { generateAnalysis } from '../gpt/generateAnalysis'
import type {
  CompareRequestCompany,
  CompareResponse,
} from '../../types/financial'

export async function runCompare(
  companies: CompareRequestCompany[],
  dartKey: string,
  openaiKey: string,
): Promise<CompareResponse> {
  if (companies.length !== 2) {
    throw new Error('정확히 2개 기업을 선택해야 합니다.')
  }

  const financials = await Promise.all(
    companies.map((c) =>
      fetchFinancialsForCompany(c.corpCode, c.stockCode, c.corpName, dartKey),
    ),
  )

  const { comparisonTable, barChartData, radarChartData } =
    buildComparisonPayload(financials)

  const analysis = await generateAnalysis(financials, openaiKey)

  return {
    companies: financials,
    comparisonTable,
    barChartData,
    radarChartData,
    analysis,
  }
}
