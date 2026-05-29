import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runCompare } from '../src/lib/compare/runCompare'
import type { CompareRequestCompany } from '../src/types/financial'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 8
const RATE_WINDOW_MS = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) {
    return false
  }

  entry.count++
  return true
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress ?? 'unknown'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' })
  }

  const dartKey = process.env.DART_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  if (!dartKey || !openaiKey) {
    return res.status(500).json({ error: '서버 환경변수가 설정되지 않았습니다.' })
  }

  const { companies } = req.body as { companies?: CompareRequestCompany[] }

  if (!companies || !Array.isArray(companies) || companies.length !== 2) {
    return res.status(400).json({ error: '비교할 기업 2개를 선택해 주세요.' })
  }

  for (const c of companies) {
    if (!c.corpCode || !c.corpName) {
      return res.status(400).json({ error: '기업 정보가 올바르지 않습니다.' })
    }
  }

  try {
    const result = await runCompare(companies, dartKey, openaiKey)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Compare failed:', error)
    const message =
      error instanceof Error ? error.message : '비교 분석에 실패했습니다.'
    return res.status(500).json({ error: message })
  }
}
