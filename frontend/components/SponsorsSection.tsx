'use client'
import { useState, useEffect } from 'react'
import { useResponsive } from '@/lib/useResponsive'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://febora-cms-production.up.railway.app'

const categoriaConfig: Record<string, { label: string; color: string; size: number }> = {
  oro:     { label: 'Patrocinador Oro',    color: '#F2A900', size: 160 },
  plata:   { label: 'Patrocinador Plata',  color: '#B0B8C1', size: 130 },
  bronce:  { label: 'Patrocinador Bronce', color: '#CD7F32', size: 110 },
  general: { label: 'Colaborador',         color: '#555',    size: 90  },
}

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState<any[]>([])
  const { isMobile, isTablet } = useResponsive()
  const pad = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2.5rem' : '7rem 4rem'

  useEffect(() => {
    fetch(`${API}/api/sponsors/`).then(r => r.ok ? r.json() : []).then(setSponsors).catch(() => {})
  }, [])

  if (sponsors.length === 0) return null

  const grupos: Record<string, any[]> = {}
  sponsors.forEach(s => { if (!grupos[s.categoria]) grupos[s.categoria] = []; grupos[s.categoria].push(s) })
  const orden = ['oro', 'plata', 'bronce', 'general'].filter(cat => grupos[cat]?.length > 0)

  return (
    <section id="sponsors" style={{ background: '#0D0D0D', padding: pad, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>Aliados estratégicos
      </div>
      <h2 style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.04em', marginBottom: isMobile ? '2rem' : '4rem' }}>
        NUESTROS <span style={{ color: '#F2A900' }}>SPONSORS</span>
      </h2>
      {orden.map(cat => {
        const config = categoriaConfig[cat]
        return (
          <div key={cat} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: config.color, border: `1px solid ${config.color}50`, padding: '0.3rem 0.8rem', borderRadius: '2px' }}>{config.label}</span>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, ${config.color}30, transparent)` }}/>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1px', justifyContent: 'center' }}>
              {grupos[cat].map(s => (
                <a key={s.id} href={s.sitio_web || '#'} target={s.sitio_web ? '_blank' : '_self'} rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: isMobile ? '1rem' : '1.5rem 2rem', width: isMobile ? '140px' : `${config.size + 40}px`, minHeight: '70px', textDecoration: 'none', transition: 'all 0.2s' }}>
                  {s.logo_url
                    ? <img src={s.logo_url} alt={s.nombre} style={{ maxWidth: isMobile ? '100px' : `${config.size}px`, maxHeight: '50px', objectFit: 'contain' }}/>
                    : <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: '1rem', color: config.color, textAlign: 'center' }}>{s.nombre}</span>
                  }
                </a>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
