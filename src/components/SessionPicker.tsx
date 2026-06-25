'use client'

import { useState } from 'react'
import { SessionParams } from '@/types'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i)

const GRAND_PRIX = [
  'Bahrain', 'Saudi Arabia', 'Australia', 'Japan', 'China',
  'Miami', 'Emilia Romagna', 'Monaco', 'Canada', 'Spain',
  'Austria', 'Britain', 'Hungary', 'Belgium', 'Netherlands',
  'Italy', 'Azerbaijan', 'Singapore', 'United States', 'Mexico',
  'Brazil', 'Las Vegas', 'Qatar', 'Abu Dhabi',
]

const SESSION_TYPES = [
  { label: 'Race', value: 'R' },
  { label: 'FP1', value: 'FP1' },
  { label: 'FP2', value: 'FP2' },
  { label: 'FP3', value: 'FP3' },
  { label: 'Sprint', value: 'S' },
]

const DRIVERS = [
  'VER', 'PER', 'LEC', 'SAI', 'HAM', 'RUS',
  'NOR', 'PIA', 'ALO', 'STR', 'GAS', 'OCO',
  'ALB', 'SAR', 'BOT', 'ZHO', 'TSU', 'RIC',
  'MAG', 'HUL',
]

const selectClass = `
  w-full rounded-lg px-3 py-2 text-sm outline-none
  transition-colors cursor-pointer appearance-none
`

const selectStyle = {
  background: '#0D0D0D',
  border: '1px solid #2A2A2A',
  color: '#F2EFE8',
  fontFamily: 'var(--font-geist-mono)',
}

interface SessionPickerProps {
  onSubmit: (params: SessionParams) => void
  loading?: boolean
}

export default function SessionPicker({ onSubmit, loading }: SessionPickerProps) {
  const [year, setYear] = useState<number>(2024)
  const [grandPrix, setGrandPrix] = useState('Bahrain')
  const [sessionType, setSessionType] = useState('R')
  const [driver, setDriver] = useState('LEC')

  const handleSubmit = () => {
    onSubmit({ year, grand_prix: grandPrix, session_type: sessionType, driver })
  }

  return (
    <div className="w-full rounded-xl p-6" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
      <p className="text-xs uppercase tracking-widest mb-4" style={{
        color: '#6B6B6B',
        fontFamily: 'var(--font-geist-mono)',
      }}>
        Session
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: '#6B6B6B', fontFamily: 'var(--font-geist-mono)' }}>Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={selectClass}
            style={selectStyle}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: '#6B6B6B', fontFamily: 'var(--font-geist-mono)' }}>Grand Prix</label>
          <select
            value={grandPrix}
            onChange={(e) => setGrandPrix(e.target.value)}
            className={selectClass}
            style={selectStyle}
          >
            {GRAND_PRIX.map((gp) => (
              <option key={gp} value={gp}>{gp}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: '#6B6B6B', fontFamily: 'var(--font-geist-mono)' }}>Session</label>
          <select
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            className={selectClass}
            style={selectStyle}
          >
            {SESSION_TYPES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: '#6B6B6B', fontFamily: 'var(--font-geist-mono)' }}>Driver</label>
          <select
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            className={selectClass}
            style={selectStyle}
          >
            {DRIVERS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg py-2 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50"
        style={{
          background: '#E8380D',
          color: '#F2EFE8',
          fontFamily: 'var(--font-geist-mono)',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Loading...' : 'Analyse Session →'}
      </button>
    </div>
  )
}