'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const form = new URLSearchParams()
      form.append('username', email)
      form.append('password', password)
      const { data } = await api.post('/api/auth/login', form.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      localStorage.setItem('febora_token', data.access_token)
      localStorage.setItem('febora_user', JSON.stringify({ nombre: data.nombre, rol: data.rol }))
      router.push('/admin/dashboard')
    } catch {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0B0B0B',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: '#141414', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px', padding: '2.5rem', width: '100%', maxWidth: '400px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', width: '5px',
            height: '24px', borderRadius: '2px', overflow: 'hidden'
          }}>
            <div style={{ background: '#C8102E', flex: 1 }}></div>
            <div style={{ background: '#F2A900', flex: 1 }}></div>
            <div style={{ background: '#007A33', flex: 1 }}></div>
          </div>
          <span style={{ fontFamily: 'serif', fontSize: '1.6rem', letterSpacing: '0.1em', color: '#F0EEE8' }}>
            FE<span style={{ color: '#F2A900' }}>BORA</span>
          </span>
        </div>

        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F0EEE8', marginBottom: '0.3rem' }}>
          Panel de Administración
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '2rem' }}>
          Ingresa tus credenciales para continuar
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="marco@febora.bo"
              style={{ width: '100%', background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px', padding: '0.65rem 0.8rem', color: '#F0EEE8',
                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>
              Contraseña
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••"
              style={{ width: '100%', background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px', padding: '0.65rem 0.8rem', color: '#F0EEE8',
                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)',
              borderRadius: '6px', padding: '0.7rem 1rem', marginBottom: '1rem',
              fontSize: '0.8rem', color: '#ff7a85' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', background: loading ? '#666' : '#C8102E',
            color: '#fff', border: 'none', borderRadius: '6px',
            padding: '0.75rem', fontSize: '0.82rem', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
          }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
