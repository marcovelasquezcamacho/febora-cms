'use client'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: scrolled ? '0.8rem 4rem' : '1.2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(13,13,13,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(242,169,0,0.12)', transition: 'padding 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '5px', height: '24px', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ background: '#C8102E', flex: 1 }}/>
          <div style={{ background: '#F2A900', flex: 1 }}/>
          <div style={{ background: '#007A33', flex: 1 }}/>
        </div>
        <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: '1.6rem', letterSpacing: '0.12em', color: '#FAFAF8' }}>
          FE<span style={{ color: '#F2A900' }}>BORA</span>
        </span>
      </div>

      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
        {[
          { label: 'Nosotros', href: '#nosotros' },
          { label: 'Jugadores', href: '#jugadores' },
          { label: 'Galería', href: '#galeria' },
          { label: 'Noticias', href: '#noticias' },
          { label: 'Contacto', href: '#contacto' },
        ].map(item => (
          <li key={item.href}>
            <a href={item.href} style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#F2A900'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(250,250,248,0.55)'}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <a href="/admin/login" style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: '#C8102E', color: '#fff', padding: '0.55rem 1.3rem', borderRadius: '2px', textDecoration: 'none', fontWeight: 600 }}
        onMouseEnter={e => (e.target as HTMLElement).style.background = '#9B0C23'}
        onMouseLeave={e => (e.target as HTMLElement).style.background = '#C8102E'}>
        Admin
      </a>
    </nav>
  )
}
