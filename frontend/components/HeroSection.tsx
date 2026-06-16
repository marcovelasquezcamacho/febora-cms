'use client'

export default function HeroSection({ hero }: { hero: any }) {
  const h = hero || {
    badge_texto: 'Federacion Nacional de Raquetbol',
    titulo_linea1: 'BOLIVIA', titulo_linea2: 'CONQUISTA', titulo_linea3: 'EL MUNDO',
    color_linea1: '#C8102E', color_linea2: '#FFFFFF', color_linea3: '#007A33',
    subtitulo: 'Bolivia se posiciona entre los mejores del planeta.',
    btn_primario_label: 'Conoce a los campeones',
    btn_secundario_label: 'Nuestra historia',
    imagen_fondo_url: null,
  }

  return (
    <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', padding: '0 4rem', overflow: 'hidden' }}>

      {/* IMAGEN DE FONDO */}
      {h.imagen_fondo_url && (
        <img src={h.imagen_fondo_url} alt="Hero background"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, zIndex: 0 }}/>
      )}

      {/* GRADIENTES */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(200,16,46,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(0,122,51,0.12) 0%, transparent 50%)',
      }}/>

      {/* OVERLAY oscuro si hay imagen */}
      {h.imagen_fondo_url && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(11,11,11,0.35)' }}/>
      )}

      {/* FRANJA TRICOLOR */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '6px', height: '100%', display: 'flex', flexDirection: 'column', zIndex: 3 }}>
        <div style={{ background: '#C8102E', flex: 1 }}/>
        <div style={{ background: '#F2A900', flex: 1 }}/>
        <div style={{ background: '#007A33', flex: 1 }}/>
      </div>

      {/* CONTENIDO */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', border: '1px solid rgba(242,169,0,0.4)', padding: '0.4rem 1rem', borderRadius: '2px', marginBottom: '2rem' }}>
          <span style={{ width: '6px', height: '6px', background: '#F2A900', borderRadius: '50%', display: 'inline-block' }}/>
          {h.badge_texto}
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', serif", fontSize: 'clamp(4.5rem, 10vw, 8rem)', lineHeight: 0.92, letterSpacing: '0.02em', marginBottom: '1.5rem' }}>
          <span style={{ color: h.color_linea1, display: 'block' }}>{h.titulo_linea1}</span>
          <span style={{ color: h.color_linea2, display: 'block' }}>{h.titulo_linea2}</span>
          <span style={{ color: h.color_linea3, display: 'block' }}>{h.titulo_linea3}</span>
        </h1>
        <p style={{ fontSize: '1.05rem', fontWeight: 300, color: 'rgba(250,250,248,0.6)', lineHeight: 1.7, maxWidth: '500px', marginBottom: '3rem' }}>{h.subtitulo}</p>
        <div style={{ display: 'flex', gap: '1.2rem' }}>
          <a href={h.btn_primario_url || '#jugadores'} style={{ background: '#C8102E', color: '#fff', padding: '0.9rem 2rem', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', textDecoration: 'none' }}>
            {h.btn_primario_label}
          </a>
          <a href={h.btn_secundario_url || '#nosotros'} style={{ background: 'transparent', color: '#FAFAF8', padding: '0.9rem 2rem', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(250,250,248,0.25)', borderRadius: '2px', textDecoration: 'none' }}>
            {h.btn_secundario_label}
          </a>
        </div>
      </div>
    </section>
  )
}
