import Link from 'next/link'

const FEATURES = [
  {
    label: 'Tyre Degradation',
    description: 'Actual vs predicted lap times per stint. Linear regression model per compound.',
  },
  {
    label: 'Pace Delta',
    description: 'Driver vs driver gap over a stint window. See where time is won and lost.',
  },
  {
    label: 'Sector Analysis',
    description: 'Sector by sector breakdown. Identify where a driver is fast or losing time.',
  },
  {
    label: 'Race Story',
    description: 'Automated key moment detection — undercuts, safety cars, fastest laps.',
  },
]

const SEASONS = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-20">
        <p className="text-xs uppercase tracking-widest mb-4" style={{
          color: '#E8380D',
          fontFamily: 'var(--font-geist-mono)',
        }}>
          Post-session analysis
        </p>
        <h1 className="text-5xl font-semibold tracking-tight leading-tight mb-6" style={{ color: '#F2EFE8' }}>
          Understand every race.<br />
          <span style={{ color: '#6B6B6B' }}>Not just watch it.</span>
        </h1>
        <p className="text-base mb-10 max-w-xl" style={{
          color: '#6B6B6B',
          fontFamily: 'var(--font-geist-mono)',
          lineHeight: 1.8,
        }}>
          F1 Debrief is a post-session analyst tool. Pick any race from 2018–2025,
          select a driver, and get tyre degradation models, sector breakdowns,
          and pace comparisons — the kind of data a race engineer sees.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/analyse"
            className="px-6 py-3 rounded-lg text-sm font-medium transition-all active:scale-[0.98]"
            style={{
              background: '#E8380D',
              color: '#F2EFE8',
              fontFamily: 'var(--font-geist-mono)',
            }}
          >
            Start analysing →
          </Link>
          <span className="text-xs" style={{ color: '#6B6B6B', fontFamily: 'var(--font-geist-mono)' }}>
            No account needed
          </span>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div style={{ borderTop: '1px solid #2A2A2A' }} />
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <p className="text-xs uppercase tracking-widest mb-10" style={{
          color: '#6B6B6B',
          fontFamily: 'var(--font-geist-mono)',
        }}>
          What's inside
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: '#2A2A2A' }}>
          {FEATURES.map((f) => (
            <div key={f.label} className="p-6" style={{ background: '#0D0D0D' }}>
              <p className="text-sm font-semibold mb-2" style={{
                color: '#F2EFE8',
                fontFamily: 'var(--font-geist-mono)',
              }}>
                {f.label}
              </p>
              <p className="text-xs leading-relaxed" style={{
                color: '#6B6B6B',
                fontFamily: 'var(--font-geist-mono)',
              }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div style={{ borderTop: '1px solid #2A2A2A' }} />
      </div>

      {/* Seasons */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <p className="text-xs uppercase tracking-widest mb-8" style={{
          color: '#6B6B6B',
          fontFamily: 'var(--font-geist-mono)',
        }}>
          Available seasons
        </p>
        <div className="flex flex-wrap gap-3">
          {SEASONS.map((s) => (
            <Link
              key={s}
              href={`/analyse?year=${s}`}
              className="px-4 py-2 rounded-lg text-xs transition-all hover:border-white/20"
              style={{
                border: '1px solid #2A2A2A',
                color: '#6B6B6B',
                fontFamily: 'var(--font-geist-mono)',
                background: '#161616',
              }}
            >
              {s} season
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="pt-8" style={{ borderTop: '1px solid #2A2A2A' }}>
          <p className="text-xs" style={{ color: '#6B6B6B', fontFamily: 'var(--font-geist-mono)' }}>
            F1 Debrief · Data via FastF1 + OpenF1 · Not affiliated with Formula 1
          </p>
        </div>
      </div>

    </main>
  )
}