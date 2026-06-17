'use client'
import { useResponsive } from '@/lib/useResponsive'

export default function StatsStrip({ stats }: { stats: any[] }) {
  const { isMobile } = useResponsive()
  const defaults = [
    { valor: 'TOP 5', etiqueta: 'Ranking Mundial' },
    { valor: '+20', etiqueta: 'Atletas nacionales' },
    { valor: '+15', etiqueta: 'Torneos internacionales' },
    { valor: '9', etiqueta: 'Departamentos afiliados' },
  ]
  const data = stats.length > 0 ? stats : defaults

  return (
    <div style={{ background: '#1A1A1A', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : `repeat(${data.length}, 1fr)` }}>
      {data.map((s: any, i: number) => (
        <div key={i} style={{ textAlign: 'center', padding: isMobile ? '1.5rem 1rem' : '2.5rem 1.5rem', borderRight: i < data.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', borderBottom: isMobile && i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
          <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '2.5rem' : '3.5rem', lineHeight: 1, background: 'linear-gradient(135deg, #F2A900, #C8102E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.valor}</div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginTop: '0.5rem' }}>{s.etiqueta}</div>
        </div>
      ))}
    </div>
  )
}
