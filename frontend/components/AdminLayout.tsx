'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const allNavItems = [
  { label: 'Dashboard',  href: '/admin/dashboard',  icon: '⊞', roles: ['superadmin', 'editor'] },
  { label: 'Hero',       href: '/admin/hero',        icon: '🖼', roles: ['superadmin', 'editor'] },
  { label: 'Jugadores',  href: '/admin/jugadores',   icon: '👤', roles: ['superadmin', 'editor'] },
  { label: 'Noticias',   href: '/admin/noticias',    icon: '📰', roles: ['superadmin', 'editor'] },
  { label: 'Logros',     href: '/admin/logros',      icon: '🏆', roles: ['superadmin', 'editor'] },
  { label: 'Galería',    href: '/admin/galeria',     icon: '🎨', roles: ['superadmin', 'editor'] },
  { label: 'Sponsors',   href: '/admin/sponsors',    icon: '🤝', roles: ['superadmin', 'editor'] },
  { label: 'Popups',     href: '/admin/popups',      icon: '💬', roles: ['superadmin', 'editor'] },
  { label: 'Contacto',   href: '/admin/contacto',    icon: '✉️',  roles: ['superadmin', 'editor'] },
  { label: 'Usuarios',   href: '/admin/usuarios',    icon: '🔑', roles: ['superadmin'] },
  { label: 'API Docs',   href: 'http://127.0.0.1:8000/docs', icon: '📋', roles: ['superadmin', 'editor'] },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ nombre: string; rol: string } | null>(null)
  const [mensajesNuevos, setMensajesNuevos] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('febora_token')
    if (!token) { router.push('/admin/login'); return }
    const u = localStorage.getItem('febora_user')
    if (u) setUser(JSON.parse(u))
    checkMensajes()
    const interval = setInterval(checkMensajes, 60000)
    return () => clearInterval(interval)
  }, [])

  const checkMensajes = async () => {
    try {
      const token = localStorage.getItem('febora_token')
      const res = await fetch('http://127.0.0.1:8000/api/contacto/?leido=false', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setMensajesNuevos(data.length)
      }
    } catch {}
  }

  const logout = () => {
    localStorage.removeItem('febora_token')
    localStorage.removeItem('febora_user')
    router.push('/admin/login')
  }

  const navItems = allNavItems.filter(item => !user || item.roles.includes(user.rol))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gridTemplateRows: '56px 1fr', height: '100vh', overflow: 'hidden', fontFamily: 'system-ui, sans-serif', background: '#0B0B0B' }}>
      <header style={{ gridColumn: '1/-1', background: '#141414', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '4px', height: '20px', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ background: '#C8102E', flex: 1 }}/>
            <div style={{ background: '#F2A900', flex: 1 }}/>
            <div style={{ background: '#007A33', flex: 1 }}/>
          </div>
          <span style={{ fontFamily: 'serif', fontSize: '1.3rem', letterSpacing: '0.1em', color: '#F0EEE8' }}>
            FE<span style={{ color: '#F2A900' }}>BORA</span>
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#444', letterSpacing: '0.08em' }}>Panel de Administración</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <span style={{ fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '2px', background: user.rol === 'superadmin' ? 'rgba(200,16,46,0.15)' : 'rgba(242,169,0,0.12)', color: user.rol === 'superadmin' ? '#ff7a85' : '#F2A900', border: `1px solid ${user.rol === 'superadmin' ? 'rgba(200,16,46,0.25)' : 'rgba(242,169,0,0.25)'}` }}>
              {user.rol}
            </span>
          )}
          <span style={{ fontSize: '0.78rem', color: '#888' }}>{user?.nombre}</span>
          <button onClick={logout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem' }}>
            Salir
          </button>
        </div>
      </header>

      <aside style={{ background: '#141414', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '1rem 0', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {navItems.map(item => (
          <a key={item.href} href={item.href}
            target={item.href.startsWith('http') ? '_blank' : '_self'}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.65rem',
              padding: '0.6rem 1rem', margin: '0 0.5rem', borderRadius: '6px',
              fontSize: '0.82rem', textDecoration: 'none', transition: 'all 0.15s',
              background: pathname === item.href ? 'rgba(200,16,46,0.1)' : 'transparent',
              color: pathname === item.href ? '#C8102E' : '#888',
              fontWeight: pathname === item.href ? 500 : 400,
            }}>
            <span>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.label === 'Contacto' && mensajesNuevos > 0 && (
              <span style={{ background: '#C8102E', color: '#fff', fontSize: '0.62rem', padding: '0.1rem 0.4rem', borderRadius: '8px', fontFamily: 'monospace' }}>
                {mensajesNuevos}
              </span>
            )}
          </a>
        ))}
      </aside>

      <main style={{ overflow: 'auto', padding: '2rem' }}>
        {children}
      </main>
    </div>
  )
}
