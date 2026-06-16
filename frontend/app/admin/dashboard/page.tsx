'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const [user, setUser] = useState<{ nombre: string; rol: string } | null>(null)
  const [stats, setStats] = useState({ jugadores: 0, noticias: 0, logros: 0 })

  useEffect(() => {
    const u = localStorage.getItem('febora_user')
    if (u) setUser(JSON.parse(u))
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [j, n, l] = await Promise.all([
        api.get('/api/jugadores/admin'),
        api.get('/api/noticias/admin'),
        api.get('/api/logros/admin'),
      ])
      setStats({ jugadores: j.data.length, noticias: n.data.length, logros: l.data.length })
    } catch {}
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '2rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.2rem' }}>DASHBOARD</h1>
        <p style={{ fontSize: '0.78rem', color: '#555' }}>Bienvenido, {user?.nombre} — {user?.rol}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        {[
          { label: 'Jugadores activos', value: stats.jugadores, color: '#C8102E' },
          { label: 'Noticias', value: stats.noticias, color: '#F2A900' },
          { label: 'Logros', value: stats.logros, color: '#007A33' },
        ].map(s => (
          <div key={s.label} style={{ background: '#141414', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.5rem' }}>{s.label}</div>
            <div style={{ fontFamily: 'serif', fontSize: '3rem', lineHeight: 1, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Accesos rápidos</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Gestionar Jugadores', href: '/admin/jugadores' },
            { label: 'Gestionar Noticias', href: '/admin/noticias' },
            { label: 'Gestionar Logros', href: '/admin/logros' },
            { label: 'Ver API Docs', href: 'https://febora-cms-production.up.railway.app/docs' },
          ].map(link => (
            <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : '_self'}
              style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.1)', color: '#888', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.78rem', textDecoration: 'none', letterSpacing: '0.06em' }}>
              {link.label} →
            </a>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
