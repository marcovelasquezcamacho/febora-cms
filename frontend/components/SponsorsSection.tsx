'use client'
import { useState, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

const categoriaConfig: Record<string, { label: string; color: string; size: number }> = {
  oro:     { label: 'Patrocinador Oro',   color: '#F2A900', size: 160 },
  plata:   { label: 'Patrocinador Plata', color: '#B0B8C1', size: 130 },
  bronce:  { label: 'Patrocinador Bronce',color: '#CD7F32', size: 110 },
  general: { label: 'Colaborador',        color: '#555',    size: 90  },
}

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState<any[]>([])

  useEffect(() => { loadSponsors() }, [])

  const loadSponsors = async () => {
    try {
      const res = await fetch(`${API}/api/sponsors/`)
      if (!res.ok) return
      const data = await res.json()
      setSponsors(data)
    } catch {}
  }

  if (sponsors.length === 0) return null

  const grupos: Record<string, any[]> = {}
  sponsors.forEach(s => {
    if (!grupos[s.categoria]) grupos[s.categoria] = []
    grupos[s.categoria].push(s)
  })

  const orden = ['oro', 'plata', 'bronce', 'general']
  const gruposOrdenados = orden.filter(cat => grupos[cat]?.length > 0)

  return (
    <section id="sponsors" style={{ background: '#0D0D0D', padding: '7rem 4rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>
        Aliados estratégicos
      </div>
      <h2 style={{ fontFamily: "'Bebas Neue', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.04em', marginBottom: '4rem' }}>
        NUESTROS <span style={{ color: '#F2A900' }}>SPONSORS</span>
      </h2>

      {gruposOrdenados.map(cat => {
        const config = categoriaConfig[cat]
        return (
          <div key={cat} style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: config.color, border: `1px solid ${config.color}50`, padding: '0.3rem 0.8rem', borderRadius: '2px' }}>
                {config.label}
              </span>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, ${config.color}30, transparent)` }}/>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5px', justifyContent: 'center' }}>
              {grupos[cat].map(s => (
                <a key={s.id} href={s.sitio_web || '#'} target={s.sitio_web ? '_blank' : '_self'} rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#141414', border: `1px solid rgba(255,255,255,0.06)`, borderRadius: '8px', padding: '1.5rem 2rem', width: `${config.size + 40}px`, minHeight: '90px', textDecoration: 'none', transition: 'all 0.2s', cursor: s.sitio_web ? 'pointer' : 'default' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = '#1A1A1A'
                    el.style.borderColor = `${config.color}40`
                    el.style.transform = 'translateY(-3px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = '#141414'
                    el.style.borderColor = 'rgba(255,255,255,0.06)'
                    el.style.transform = 'translateY(0)'
                  }}>
                  {s.logo_url
                    ? <img src={s.logo_url} alt={s.nombre}
                        style={{ maxWidth: `${config.size}px`, maxHeight: '60px', objectFit: 'contain', filter: 'brightness(0.85) grayscale(0.2)', transition: 'filter 0.2s' }}
                        onMouseEnter={e => (e.target as HTMLElement).style.filter = 'brightness(1) grayscale(0)'}
                        onMouseLeave={e => (e.target as HTMLElement).style.filter = 'brightness(0.85) grayscale(0.2)'}/>
                    : <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: cat === 'oro' ? '1.4rem' : '1.1rem', letterSpacing: '0.1em', color: config.color, textAlign: 'center' }}>
                        {s.nombre}
                      </span>
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
