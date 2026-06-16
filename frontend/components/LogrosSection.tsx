export default function LogrosSection({ logros }: { logros: any[] }) {
  const acentos: Record<string, string> = {
    rojo: '#C8102E', amarillo: '#F2A900', verde: '#007A33'
  }

  return (
    <section id="logros" style={{ background: '#0D0D0D', padding: '7rem 4rem' }}>
      <div style={{
        fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px'
      }}>
        <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>
        Palmares
      </div>
      <h2 style={{
        fontFamily: "'Bebas Neue', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        letterSpacing: '0.04em', marginBottom: '4rem'
      }}>
        NUESTROS <span style={{ color: '#C8102E' }}>LOGROS</span>
      </h2>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px', background: 'rgba(255,255,255,0.06)'
      }}>
        {logros.map((l: any) => (
          <div key={l.id} style={{
            background: '#0D0D0D', padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden',
            borderLeft: `3px solid ${acentos[l.color_acento] || '#C8102E'}`
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1.2rem' }}>{l.icono}</div>
            <div style={{
              fontFamily: "'Bebas Neue', serif", fontSize: '3rem', lineHeight: 1, color: '#FAFAF8'
            }}>{l.numero}</div>
            <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '0.5rem', lineHeight: 1.6 }}>
              {l.descripcion}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
