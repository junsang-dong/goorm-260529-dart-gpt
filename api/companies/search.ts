import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getKospiCompanies } from '../lib/kospi'
import { searchCompanies } from '../lib/search'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const q = typeof req.query.q === 'string' ? req.query.q : ''
    const results = searchCompanies(getKospiCompanies(), q)
    return res.status(200).json({ results })
  } catch (error) {
    console.error('Company search failed:', error)
    return res.status(500).json({ error: '기업 검색에 실패했습니다.' })
  }
}
