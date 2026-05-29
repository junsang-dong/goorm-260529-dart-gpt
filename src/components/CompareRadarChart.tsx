import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { RadarChartDatum } from '../types/financial'

const COLORS = ['#0B3954', '#5C5749']

interface CompareRadarChartProps {
  data: RadarChartDatum[]
  companyNames: string[]
}

export function CompareRadarChart({ data, companyNames }: CompareRadarChartProps) {
  return (
    <div className="h-80 w-full border border-[var(--color-wsj-border)] bg-white/40 p-4">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-wsj-accent)]">
        종합 경쟁력 비교
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <RadarChart data={data}>
          <PolarGrid stroke="#D8D2C2" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              fontFamily: 'Georgia, serif',
              border: '1px solid #D8D2C2',
            }}
          />
          <Legend />
          {companyNames.map((name, i) => (
            <Radar
              key={name}
              name={name}
              dataKey={name}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.25}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
