'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="w-full border-b sticky top-0 z-50" style={{
      background: '#0D0D0D',
      borderColor: '#2A2A2A',
    }}>
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: '#E8380D' }} />
          <span className="text-sm font-semibold tracking-tight" style={{
            color: '#F2EFE8',
            fontFamily: 'var(--font-geist-mono)',
          }}>
            F1 Debrief
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/analyse"
            className="text-xs uppercase tracking-widest transition-colors"
            style={{
              color: pathname === '/analyse' ? '#F2EFE8' : '#6B6B6B',
              fontFamily: 'var(--font-geist-mono)',
            }}
          >
            Analyse
          </Link>
          <Link
            href="/"
            className="text-xs uppercase tracking-widest transition-colors"
            style={{
              color: pathname === '/' ? '#F2EFE8' : '#6B6B6B',
              fontFamily: 'var(--font-geist-mono)',
            }}
          >
            Home
          </Link>
        </div>

      </div>
    </nav>
  )
}