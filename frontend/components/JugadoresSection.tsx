'use client'
import { useResponsive } from '@/lib/useResponsive'

export default function JugadoresSection({ jugadores }: { jugadores: any[] }) {
  const { isMobile, isTablet } = useResponsive()
  const colors = ['#1a0508', '#0d1a08', '#1a140a', '#080d1a']
  const pad = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2.5rem' : '7rem 4rem'
  const cols = isMobile ? 2 : Math.min(jugadores.length, 4)

  return (
    <section id="jugadores" style={{ background: '#0D0D0D', padding: pad }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>Elite nacional
      </div>
      <h2 style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.04em', marginBottom: isMobile ? '2rem' : '4rem', lineHeight: 1.1 }}>
        LOS QUE <span style={{ color: '#F2A900' }}>REPRESENTAN</span> A BOLIVIA
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '2px' }}>
        {jugadores.map((j: any, i: number) => (
          <a key={j.id} href={`/jugadores/${j.id}`} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', cursor: 'pointer', textDecoration: 'none', background: `linear-gradient(145deg, ${colors[i % colors.length]}, ${colors[(i+1) % colors.length]})` }}>
            {j.foto_url && <img src={j.foto_url} alt={j.nombre} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.4) 50%, transparent 100%)', padding: isMobile ? '1rem' : '2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {!j.foto_url && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '3rem' : '5rem', opacity: 0.1, color: '#fff' }}>{j.iniciales}</div>}
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#F2A900', marginBottom: '0.3rem' }}>🏆 {j.ranking_etiqueta}</div>
              <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '1.1rem' : '1.6rem', letterSpacing: '0.06em', lineHeight: 1.1, marginBottom: '0.3rem', color: '#FAFAF8' }}>
                {j.nombre.toUpperCase()}<br/>{j.apellido.toUpperCase()}
              </div>
              {!isMobile && <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>Raquetbol — {j.nacionalidad}</div>}
              <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.6rem', borderRadius: '2px', fontWeight: 600, background: 'rgba(200,16,46,0.2)', color: '#C8102E', border: '1px solid rgba(200,16,46,0.4)', width: 'fit-content' }}>{j.tag_texto}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
