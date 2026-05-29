import type { VercelRequest, VercelResponse } from '@vercel/node'
import { KOSPI_COMPANIES } from '../../src/lib/companies/kospiData'
import { searchCompanies } from '../../src/lib/companies/searchCompanies'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const q = typeof req.query.q === 'string' ? req.query.q : ''
  const results = searchCompanies(KOSPI_COMPANIES, q)
  return res.status(200).json({ results })
}
