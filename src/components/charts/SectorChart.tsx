'use client'

import { useState } from 'react'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Lap } from '@/types'
import { formatLapTime } from '@/lib/utils'

const COMPOUND_COLORS: Record<string, string> = {
  SOFT: '#E8380D',
  MEDIUM: '#F5C518',
  HARD: '#D4D0C8',
  INTERMEDIATE: '#4CAF50',
  WET: '#1E90FF',
}

interface SectorChartProps {
  laps: Lap[]
  driver: string
}

type SectorKey = 'Sector1Time' | 'Sector2Time' | 'Sector3Time'
type DeltaKey = 's1Delta' | 's2Delta' | 's3Delta'

interface CleanLap {
  LapNumber: number
  LapTime: number
  Sector1Time: number
  Sector2Time: number
  Sector3Time: number
  Compound: string
  TyreLife: number
  s1Delta: number
  s2Delta: number
  s3Delta: number
}

const SECTORS: { key: SectorKey; deltaKey: DeltaKey; label: string; color: string }[] = [
  { key: 'Sector1Time', deltaKey: 's1Delta', label: 'S1', color: '#7C6AF5' },
  { key: 'Sector2Time', deltaKey: 's2Delta', label: 'S2', color: '#F5A623' },
  { key: 'Sector3Time', deltaKey: 's3Delta', label: 'S3', color: '#50C878' },
]

const toNum = (val: any): number | null => {
  if (val == null || val === 'NaT' || val === '') return null
  const n = typeof val === 'number' ? val : parseFloat(val)
  return isNaN(n) ? null : n
}

const getMedian = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const lap: CleanLap = payload[0]?.payload
  if (!lap) return null

  return (
    <div style={{
      background: '#161616',
      border: '1px solid #2A2A2A',
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: 'var(--font-geist-mono)',
      fontSize: 12,
      minWidth: 180,
    }}>
      <p style={{ color: '#6B6B6B', marginBottom: 6 }}>
        Lap {lap.LapNumber} ·{' '}
        <span style={{ color: COMPOUND_COLORS[lap.Compound] ?? '#fff' }}>
          {lap.Compound}
        </span>
      </p>
      {SECTORS.map((s) => (
        <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
          <span style={{ color: s.color }}>{s.label}</span>
          <span style={{ color: '#F2EFE8' }}>{lap[s.key].toFixed(3)}s</span>
        </div>
      ))}
      <div style={{ borderTop: '1px solid #2A2A2A', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ color: '#6B6B6B' }}>Total</span>
        <span style={{ color: '#F2EFE8' }}>{formatLapTime(lap.LapTime)}</span>
      </div>
    </div>
  )
}

export default function SectorChart({ laps, driver }: SectorChartProps) {
  const [activeSector, setActiveSector] = useState<{ key: SectorKey; deltaKey: DeltaKey; label: string; color: string }>(SECTORS[0])

  const lapTimes = laps.map((l) => l.LapTime).filter(Boolean)
  const median = getMedian(lapTimes)

  // Normalise all sector times to numbers, filter bad laps
  const cleanLaps: CleanLap[] = laps
    .map((l) => ({
      ...l,
      s1: toNum(l.Sector1Time),
      s2: toNum(l.Sector2Time),
      s3: toNum(l.Sector3Time),
    }))
    .filter((l) =>
      l.LapTime <= median * 1.07 &&
      l.s1 !== null &&
      l.s2 !== null &&
      l.s3 !== null
    )
    .map((l) => ({
      LapNumber: l.LapNumber,
      LapTime: l.LapTime,
      Compound: l.Compound,
      TyreLife: l.TyreLife,
      Sector1Time: l.s1 as number,
      Sector2Time: l.s2 as number,
      Sector3Time: l.s3 as number,
      s1Delta: 0,
      s2Delta: 0,
      s3Delta: 0,
    }))

  if (cleanLaps.length === 0) {
    return (
      <div className="w-full rounded-xl p-8 flex items-center justify-center" style={{
        background: '#161616',
        border: '1px solid #2A2A2A',
      }}>
        <p className="text-xs" style={{ color: '#6B6B6B', fontFamily: 'var(--font-geist-mono)' }}>
          Not enough clean sector data for this session.
        </p>
      </div>
    )
  }

  const bestS1 = Math.min(...cleanLaps.map((l) => l.Sector1Time))
  const bestS2 = Math.min(...cleanLaps.map((l) => l.Sector2Time))
  const bestS3 = Math.min(...cleanLaps.map((l) => l.Sector3Time))

  const chartData: CleanLap[] = cleanLaps.map((l) => ({
    ...l,
    s1Delta: parseFloat((l.Sector1Time - bestS1).toFixed(4)),
    s2Delta: parseFloat((l.Sector2Time - bestS2).toFixed(4)),
    s3Delta: parseFloat((l.Sector3Time - bestS3).toFixed(4)),
  }))

  const bests = { Sector1Time: bestS1, Sector2Time: bestS2, Sector3Time: bestS3 }

  return (
    <div className="w-full rounded-xl p-6" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest mb-1" style={{
          color: '#6B6B6B',
          fontFamily: 'var(--font-geist-mono)',
        }}>
          Sector Analysis
        </p>
        <h2 className="text-xl font-semibold" style={{ color: '#F2EFE8' }}>
          {driver.toUpperCase()} — Delta from Best Sector
        </h2>
        <p className="text-xs mt-1" style={{ color: '#6B6B6B', fontFamily: 'var(--font-geist-mono)' }}>
          Each bar shows time lost vs personal best in that sector. 0 = personal best.
        </p>
      </div>

      {/* Sector selector */}
      <div className="flex gap-2 mb-6">
        {SECTORS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSector(s)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: activeSector.key === s.key ? s.color : '#0D0D0D',
              color: activeSector.key === s.key ? '#0D0D0D' : '#6B6B6B',
              border: `1px solid ${activeSector.key === s.key ? s.color : '#2A2A2A'}`,
              fontFamily: 'var(--font-geist-mono)',
              cursor: 'pointer',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Best sector callout */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {SECTORS.map((s) => (
          <div key={s.key} className="rounded-lg px-3 py-2" style={{
            background: '#0D0D0D',
            border: `1px solid ${activeSector.key === s.key ? s.color + '44' : '#2A2A2A'}`,
          }}>
            <p className="text-xs mb-1" style={{ color: s.color, fontFamily: 'var(--font-geist-mono)' }}>
              Best {s.label}
            </p>
            <p className="text-sm font-semibold" style={{ color: '#F2EFE8', fontFamily: 'var(--font-geist-mono)' }}>
              {bests[s.key].toFixed(3)}s
            </p>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
          <XAxis
            dataKey="LapNumber"
            tick={{ fill: '#6B6B6B', fontSize: 11, fontFamily: 'var(--font-geist-mono)' }}
            tickLine={false}
            axisLine={{ stroke: '#2A2A2A' }}
            label={{
              value: 'Lap',
              position: 'insideBottom',
              offset: -12,
              fill: '#6B6B6B',
              fontSize: 11,
              fontFamily: 'var(--font-geist-mono)',
            }}
          />
          <YAxis
            tickFormatter={(v) => `+${v.toFixed(2)}s`}
            tick={{ fill: '#6B6B6B', fontSize: 11, fontFamily: 'var(--font-geist-mono)' }}
            tickLine={false}
            axisLine={false}
            width={72}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke={activeSector.color} strokeWidth={1} strokeDasharray="4 4" />
          <Bar
            dataKey={activeSector.deltaKey}
            name={activeSector.label}
            radius={[3, 3, 0, 0]}
            maxBarSize={20}
            fill={activeSector.color}
            fillOpacity={0.8}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

    </div>
  )
}