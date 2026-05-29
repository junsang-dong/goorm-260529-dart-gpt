/**
 * Usage (from project root):
 *   node --env-file=.env.local --import tsx scripts/verify-compare.mjs
 * Or: npx tsx --env-file=.env.local scripts/verify-compare.mjs
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const dartKey = process.env.DART_API_KEY
const openaiKey = process.env.OPENAI_API_KEY

if (!dartKey || !openaiKey) {
  console.error('Set DART_API_KEY and OPENAI_API_KEY in .env.local')
  process.exit(1)
}

const pairs = [
  ['삼성전자', '00126380', '005930', 'SK하이닉스', '00164779', '000660'],
  ['POSCO홀딩스', '00155319', '005490', '현대차', '00164742', '005380'],
  ['LG에너지솔루션', '01515323', '373220', '삼성SDI', '00126362', '006400'],
]

const { runCompare } = await import('../src/lib/compare/runCompare.ts')

console.log('KOSPI Financial Compare — E2E verify\n')

for (const [nameA, corpA, stockA, nameB, corpB, stockB] of pairs) {
  const start = Date.now()
  const result = await runCompare(
    [
      { corpCode: corpA, stockCode: stockA, corpName: nameA },
      { corpCode: corpB, stockCode: stockB, corpName: nameB },
    ],
    dartKey,
    openaiKey,
  )
  const elapsed = (Date.now() - start) / 1000
  console.log(`✓ ${nameA} vs ${nameB} (${elapsed.toFixed(1)}s)`)
  console.log(`  ${result.analysis.summary.slice(0, 100)}…`)
  if (elapsed > 30) console.warn('  ⚠ Exceeded 30s target')
}

const jsFile = readdirSync(join(root, 'dist/assets')).find(
  (f) => f.startsWith('index-') && f.endsWith('.js'),
)
const js = readFileSync(join(root, 'dist/assets', jsFile), 'utf8')
if (js.includes('sk-') || js.includes(dartKey) || js.includes(openaiKey)) {
  console.error('\n✗ API key found in client bundle!')
  process.exit(1)
}
console.log('\n✓ No API keys in client bundle')
