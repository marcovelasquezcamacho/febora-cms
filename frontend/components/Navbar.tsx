'use client'
import { useState, useEffect } from 'react'
import { useResponsive } from '@/lib/useResponsive'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isMobile } = useResponsive()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Jugadores', href: '#jugadores' },
    { label: 'Galería', href: '#galeria' },
    { label: 'Noticias', href: '#noticias' },
    { label: 'Contacto', href: '#contacto' },
  ]

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: scrolled ? '0.8rem 1.5rem' : '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(13,13,13,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(242,169,0,0.12)', transition: 'padding 0.3s ease' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '5px', height: '24px', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ background: '#C8102E', flex: 1 }}/>
            <div style={{ background: '#F2A900', flex: 1 }}/>
            <div style={{ background: '#007A33', flex: 1 }}/>
          </div>
          <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '1.3rem' : '1.6rem', letterSpacing: '0.12em', color: '#FAFAF8' }}>
            FE<span style={{ color: '#F2A900' }}>BORA</span>
          </span>
        </div>

        {/* Desktop links */}
        {!isMobile && (
          <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
            {navLinks.map(item => (
              <li key={item.href}>
                <a href={item.href} style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = '#F2A900'}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(250,250,248,0.55)'}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {!isMobile && (
            <a href="/admin/login" style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: '#C8102E', color: '#fff', padding: '0.55rem 1.3rem', borderRadius: '2px', textDecoration: 'none', fontWeight: 600 }}>
              Admin
            </a>
          )}
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#F0EEE8', padding: '0.4rem 0.7rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div style={{ position: 'fixed', top: '56px', left: 0, right: 0, background: 'rgba(13,13,13,0.98)', backdropFilter: 'blur(12px)', zIndex: 99, padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {navLinks.map(item => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '0.85rem 0', fontSize: '0.9rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,250,248,0.7)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {item.label}
            </a>
          ))}
          <a href="/admin/login" style={{ display: 'block', marginTop: '1rem', background: '#C8102E', color: '#fff', padding: '0.75rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 600, fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center' }}>
            Admin
          </a>
        </div>
      )}
    </>
  )
}
