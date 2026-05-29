import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { BarChartDatum } from '../types/financial'

const COLORS = ['#0B3954', '#5C5749']

function formatAxis(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_0000_0000_0000) return `${(value / 1_0000_0000_0000).toFixed(0)}조`
  if (abs >= 1_0000_0000) return `${(value / 1_0000_0000).toFixed(0)}억`
  return `${(value / 1_0000).toFixed(0)}만`
}

interface CompareBarChartProps {
  data: BarChartDatum[]
  companyNames: string[]
}

export function CompareBarChart({ data, companyNames }: CompareBarChartProps) {
  return (
    <div className="h-80 w-full border border-[var(--color-wsj-border)] bg-white/40 p-4">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-wsj-accent)]">
        주요 손익 비교
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#D8D2C2" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={formatAxis} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value: number) => formatAxis(value)}
            contentStyle={{
              fontFamily: 'Georgia, serif',
              border: '1px solid #D8D2C2',
            }}
          />
          <Legend />
          {companyNames.map((name, i) => (
            <Bar key={name} dataKey={name} fill={COLORS[i % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
