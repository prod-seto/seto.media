import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'BPM + Key Detector — seto.media',
  description: 'Drop an audio file to instantly detect tempo and musical key. No upload — all processing happens in your browser.',
}

export default function BpmKeyPage() {
  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 40px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <p className="type-label" style={{ color: '#5A8AAA' }}>producer tools</p>
        <Link href="/tools" className="type-label" style={{ color: '#5A8AAA', textDecoration: 'none' }}>
          ← tools
        </Link>
      </div>

      <h1
        className="type-display"
        style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#2A6094', marginBottom: '8px' }}
      >
        bpm + key detector
      </h1>
      <p className="type-body" style={{ fontSize: '16px', color: '#5A8AAA', marginBottom: '40px' }}>
        drop an audio file to instantly detect tempo and musical key — nothing leaves your browser
      </p>

      <div
        className="ghost-panel"
        style={{
          padding: '64px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '240px',
          textAlign: 'center',
          gap: '16px',
        }}
      >
        <p className="type-display" style={{ fontSize: '40px', color: 'rgba(90,158,212,0.25)', lineHeight: 1 }}>◈</p>
        <p className="type-label" style={{ color: '#5A8AAA', letterSpacing: '4px' }}>coming soon</p>
      </div>
    </main>
  )
}
