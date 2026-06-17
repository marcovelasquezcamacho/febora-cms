'use client'
import { useResponsive } from '@/lib/useResponsive'

export default function Footer() {
  const { isMobile } = useResponsive()

  return (
    <footer style={{ background: '#1A1A1A', borderTop: '1px solid rgba(255,255,255,0.06)', padding: isMobile ? '2rem 1.5rem' : '3rem 4rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '4px', height: '20px', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{ background: '#C8102E', flex: 1 }}/><div style={{ background: '#F2A900', flex: 1 }}/><div style={{ background: '#007A33', flex: 1 }}/>
            </div>
            <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: '1.3rem', letterSpacing: '0.12em', color: '#FAFAF8' }}>
              FE<span style={{ color: '#F2A900' }}>BORA</span>
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#444', letterSpacing: '0.05em' }}>
            © 2025 Federación Nacional de Raquetbol de Bolivia — Todos los derechos reservados
          </div>
        </div>
        <ul style={{ display: 'flex', gap: isMobile ? '1rem' : '2rem', listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
          {[{ label: 'Contacto', href: '#contacto' }, { label: 'Reglamento', href: '#reglamento' }, { label: 'Resultados', href: '#resultados' }, { label: 'Afiliación', href: '#afiliacion' }].map(link => (
            <li key={link.href}>
              <a href={link.href} style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', textDecoration: 'none' }}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ display: 'flex', height: '3px', marginTop: '2rem', borderRadius: '1px', overflow: 'hidden' }}>
        <div style={{ background: '#C8102E', flex: 1 }}/><div style={{ background: '#F2A900', flex: 1 }}/><div style={{ background: '#007A33', flex: 1 }}/>
      </div>
    </footer>
  )
}
