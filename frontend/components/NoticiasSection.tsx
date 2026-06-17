'use client'
import { useResponsive } from '@/lib/useResponsive'

export default function NoticiasSection({ noticias }: { noticias: any[] }) {
  const { isMobile, isTablet } = useResponsive()
  const pad = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2.5rem' : '7rem 4rem'
  const catColors: Record<string, string> = { red: '#ff6b7a', green: '#4CAF7D', yellow: '#F2A900' }

  return (
    <section id="noticias" style={{ background: '#1A1A1A', padding: pad }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>Actualidad
      </div>
      <h2 style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.04em', marginBottom: isMobile ? '2rem' : '4rem' }}>
        ULTIMAS <span style={{ color: '#F2A900' }}>NOTICIAS</span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : noticias.length > 1 ? '2fr 1fr' : '1fr', gap: '1.5px', background: 'rgba(255,255,255,0.06)' }}>
        {noticias.map((n: any, i: number) => (
          <a key={n.id} href={`/noticias/${n.slug}`} style={{ background: '#1A1A1A', padding: isMobile ? '1.5rem' : '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: i === 0 && !isMobile ? '360px' : '200px', textDecoration: 'none', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#242424'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1A1A1A'}>
            <div>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.3rem 0.7rem', borderRadius: '2px', display: 'inline-block', marginBottom: '1rem', background: 'rgba(200,16,46,0.15)', color: catColors[n.categoria_color] || '#ff6b7a' }}>
                {n.categoria}
              </span>
              <h3 style={{ fontFamily: "'Bebas Neue', serif", fontSize: i === 0 && !isMobile ? '2rem' : '1.3rem', letterSpacing: '0.04em', lineHeight: 1.15, color: '#FAFAF8' }}>
                {n.titulo}
              </h3>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '0.08em', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              FEBORA · {n.categoria} · {new Date(n.fecha_publicacion).getFullYear()} →
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
