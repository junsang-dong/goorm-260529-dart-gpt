export function Header() {
  return (
    <header className="border-b border-[var(--color-wsj-border)] bg-[var(--color-wsj-bg)]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-wsj-accent)]">
          KOSPI Financial Compare
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--color-wsj-text)] sm:text-4xl">
          Financial Compare AI
        </h1>
        <p className="mt-2 text-sm text-[var(--color-wsj-muted)]">
          Wall Street Journal 스타일 · AI 기업 비교 분석
        </p>
      </div>
    </header>
  )
}
