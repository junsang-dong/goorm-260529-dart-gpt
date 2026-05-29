import type { GptAnalysis } from '../types/financial'

interface GptCommentaryProps {
  analysis: GptAnalysis
}

export function GptCommentary({ analysis }: GptCommentaryProps) {
  return (
    <article className="border-2 border-[var(--color-wsj-accent)] bg-white/60 p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-wsj-accent)]">
        AI Analyst Commentary
      </p>
      <h3 className="mt-2 text-2xl font-bold">투자 인사이트</h3>

      <p className="mt-4 text-base leading-relaxed italic text-[var(--color-wsj-text)]">
        {analysis.summary}
      </p>

      <p className="mt-6 border-l-4 border-[var(--color-wsj-accent)] pl-4 text-base leading-relaxed">
        {analysis.comparison}
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {analysis.companies.map((company) => (
          <section key={company.name} className="border-t border-[var(--color-wsj-border)] pt-6">
            <h4 className="text-lg font-bold">{company.name}</h4>

            <div className="mt-4">
              <h5 className="text-xs font-bold uppercase text-[var(--color-wsj-accent)]">강점</h5>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                {company.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-bold uppercase text-[var(--color-wsj-muted)]">약점</h5>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                {company.weaknesses.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-bold uppercase">투자 시 고려사항</h5>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                {company.considerations.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      {analysis.investmentConsiderations.length > 0 && (
        <section className="mt-8 border-t border-[var(--color-wsj-border)] pt-6">
          <h4 className="text-sm font-bold uppercase tracking-wider">종합 투자 고려사항</h4>
          <ul className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
            {analysis.investmentConsiderations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
