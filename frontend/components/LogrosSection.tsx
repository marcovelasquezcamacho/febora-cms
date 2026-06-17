'use client'
import { useResponsive } from '@/lib/useResponsive'

export default function LogrosSection({ logros }: { logros: any[] }) {
  const { isMobile, isTablet } = useResponsive()
  const pad = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2.5rem' : '7rem 4rem'
  const cols = isMobile ? 1 : isTablet ? 2 : 3
  const acentos: Record<string, string> = { rojo: '#C8102E', amarillo: '#F2A900', verde: '#007A33' }

  return (
    <section id="logros" style={{ background: '#0D0D0D', padding: pad }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>Palmarés
      </div>
      <h2 style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.04em', marginBottom: isMobile ? '2rem' : '4rem' }}>
        NUESTROS <span style={{ color: '#C8102E' }}>LOGROS</span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
        {logros.map((l: any) => (
          <div key={l.id} style={{ background: '#0D0D0D', padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem', borderLeft: `3px solid ${acentos[l.color_acento] || '#C8102E'}` }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{l.icono}</div>
            <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '2.2rem' : '3rem', lineHeight: 1, color: '#FAFAF8' }}>{l.numero}</div>
            <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '0.5rem', lineHeight: 1.6 }}>{l.descripcion}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
