'use client'
export default function NosotrosSection() {
  return (
    <section id="nosotros" style={{ background: '#1A1A1A', padding: '7rem 4rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', height: '400px' }}>
          <div style={{
            position: 'absolute', left: '-1rem', top: '50%', transform: 'translateY(-50%)',
            fontFamily: "'Bebas Neue', serif", fontSize: '16rem', lineHeight: 1,
            color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.04)',
            userSelect: 'none'
          }}>F</div>
          <div style={{
            position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', width: '70px', height: '210px',
            borderRadius: '4px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{ background: '#C8102E', flex: 1 }}/>
            <div style={{ background: '#F2A900', flex: 1 }}/>
            <div style={{ background: '#007A33', flex: 1 }}/>
          </div>
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
            <svg viewBox="0 0 180 200" width="160" height="180" fill="none">
              <path d="M90 4 L170 36 L170 110 Q170 165 90 196 Q10 165 10 110 L10 36 Z" stroke="rgba(242,169,0,0.25)" strokeWidth="1" fill="none"/>
              <path d="M90 20 L155 47 L155 108 Q155 155 90 182 Q25 155 25 108 L25 47 Z" stroke="rgba(242,169,0,0.12)" strokeWidth="1" fill="rgba(242,169,0,0.03)"/>
              <text x="90" y="108" textAnchor="middle" fontFamily="'Bebas Neue', serif" fontSize="38" fill="rgba(242,169,0,0.4)" letterSpacing="2">FEBORA</text>
              <text x="90" y="132" textAnchor="middle" fontFamily="system-ui" fontSize="8" fill="rgba(250,250,248,0.2)" letterSpacing="4">BOLIVIA</text>
            </svg>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>
            Quiénes somos
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', serif", fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', letterSpacing: '0.04em', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            LA VOZ DEL<br/>
            <span style={{ color: '#007A33' }}>RAQUETBOL</span><br/>
            BOLIVIANO
          </h2>
          <p style={{ fontSize: '0.95rem', fontWeight: 300, color: 'rgba(250,250,248,0.6)', lineHeight: 1.85, marginBottom: '1.2rem' }}>
            La <strong style={{ color: '#F2A900', fontWeight: 600 }}>Federación Nacional de Raquetbol de Bolivia (FEBORA)</strong> es el organismo rector de esta disciplina en el país. Trabajamos para desarrollar, promover y proyectar el raquetbol boliviano hacia la cima del deporte internacional.
          </p>
          <p style={{ fontSize: '0.95rem', fontWeight: 300, color: 'rgba(250,250,248,0.6)', lineHeight: 1.85, marginBottom: '2rem' }}>
            Con atletas posicionados en el <strong style={{ color: '#F2A900', fontWeight: 600 }}>top 5 mundial</strong>, Bolivia ha consolidado su presencia en el escenario global del raquetbol.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {['Alto rendimiento', 'Formación deportiva', 'Competición internacional', 'Desarrollo regional', 'Inclusión deportiva'].map(pill => (
              <span key={pill} style={{
                fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '0.4rem 1rem', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '2px', color: 'rgba(255,255,255,0.4)'
              }}>{pill}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
