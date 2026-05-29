import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { runCompare } from './src/lib/compare/runCompare'
import { KOSPI_COMPANIES } from './src/lib/companies/kospiData'
import { searchCompanies } from './src/lib/companies/searchCompanies'
import type { CompareRequestCompany } from './src/types/financial'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString()))
    req.on('error', reject)
  })
}

function apiDevPlugin(dartKey: string, openaiKey: string): PluginOption {
  return {
    name: 'api-dev',
    configureServer(server) {
      server.middlewares.use(
        async (req: IncomingMessage, res: ServerResponse, next) => {
          const url = req.url ?? ''

          if (url.startsWith('/api/companies/search') && req.method === 'GET') {
            const parsed = new URL(url, 'http://localhost')
            const q = parsed.searchParams.get('q') ?? ''
            const results = searchCompanies(KOSPI_COMPANIES, q)
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify({ results }))
            return
          }

          if (url === '/api/compare' && req.method === 'POST') {
            try {
              const body = await readBody(req)
              const { companies } = JSON.parse(body) as {
                companies: CompareRequestCompany[]
              }
              const result = await runCompare(companies, dartKey, openaiKey)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (error) {
              console.error('Dev compare API error:', error)
              const message =
                error instanceof Error ? error.message : '비교 분석에 실패했습니다.'
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 500
              res.end(JSON.stringify({ error: message }))
            }
            return
          }

          next()
        },
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const plugins: PluginOption[] = [react(), tailwindcss()]

  if (env.DART_API_KEY && env.OPENAI_API_KEY) {
    plugins.push(apiDevPlugin(env.DART_API_KEY, env.OPENAI_API_KEY))
  }

  return {
    plugins,
  }
})
