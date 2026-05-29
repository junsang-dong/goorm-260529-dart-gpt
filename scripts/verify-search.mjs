import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const list = JSON.parse(
  readFileSync(join(__dirname, '../public/data/kospi-companies.json'), 'utf8'),
)

function search(q) {
  const query = q.trim().toLowerCase()
  return list
    .filter(
      (c) =>
        c.corp_name.toLowerCase().includes(query) ||
        c.stock_code.includes(query),
    )
    .slice(0, 12)
}

const tests = ['삼성', '005930', 'SK하이닉스', 'POSCO', '373220']
let ok = true
for (const q of tests) {
  const results = search(q)
  console.log(`"${q}" → ${results.length} results`, results[0]?.corp_name ?? '(none)')
  if (results.length === 0) ok = false
}
process.exit(ok ? 0 : 1)
