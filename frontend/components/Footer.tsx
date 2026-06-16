'use client'
export default function Footer() {
  return (
    <footer style={{
      background: '#1A1A1A', borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '3rem 4rem'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '4px', height: '20px', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{ background: '#C8102E', flex: 1 }}/>
              <div style={{ background: '#F2A900', flex: 1 }}/>
              <div style={{ background: '#007A33', flex: 1 }}/>
            </div>
            <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: '1.3rem', letterSpacing: '0.12em', color: '#FAFAF8' }}>
              FE<span style={{ color: '#F2A900' }}>BORA</span>
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#444', letterSpacing: '0.05em' }}>
            © 2025 Federación Nacional de Raquetbol de Bolivia — Todos los derechos reservados
          </div>
        </div>
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {[
            { label: 'Contacto', href: '#contacto' },
            { label: 'Reglamento', href: '#reglamento' },
            { label: 'Resultados', href: '#resultados' },
            { label: 'Afiliación', href: '#afiliacion' },
          ].map(link => (
            <li key={link.href}>
              <a href={link.href} style={{
                fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#555', textDecoration: 'none', transition: 'color 0.2s'
              }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#F2A900'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#555'}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ display: 'flex', height: '3px', marginTop: '2rem', borderRadius: '1px', overflow: 'hidden' }}>
        <div style={{ background: '#C8102E', flex: 1 }}/>
        <div style={{ background: '#F2A900', flex: 1 }}/>
        <div style={{ background: '#007A33', flex: 1 }}/>
      </div>
    </footer>
  )
}
