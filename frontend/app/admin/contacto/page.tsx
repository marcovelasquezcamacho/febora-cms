'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

export default function ContactoAdminPage() {
  const [mensajes, setMensajes] = useState<any[]>([])
  const [filtro, setFiltro] = useState<'todos' | 'leido' | 'no_leido'>('todos')
  const [selected, setSelected] = useState<any>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadMensajes() }, [])

  const loadMensajes = async () => {
    try {
      const { data } = await api.get('/api/contacto/')
      setMensajes(data)
    } catch {}
  }

  const notify = (text: string) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleSelect = async (m: any) => {
    setSelected(m)
    if (!m.leido) {
      try {
        await api.put(`/api/contacto/${m.id}/leido`)
        setMensajes(prev => prev.map(x => x.id === m.id ? { ...x, leido: true } : x))
      } catch {}
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    try {
      await api.delete(`/api/contacto/${id}`)
      notify('Mensaje eliminado')
      if (selected?.id === id) setSelected(null)
      loadMensajes()
    } catch { notify('Error al eliminar') }
  }

  const filtrados = mensajes.filter(m => {
    if (filtro === 'leido') return m.leido
    if (filtro === 'no_leido') return !m.leido
    return true
  })

  const noLeidos = mensajes.filter(m => !m.leido).length

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.2rem' }}>
            CONTACTO
            {noLeidos > 0 && (
              <span style={{ marginLeft: '0.75rem', fontSize: '0.9rem', background: '#C8102E', color: '#fff', padding: '0.1rem 0.5rem', borderRadius: '10px', fontFamily: 'monospace', verticalAlign: 'middle' }}>
                {noLeidos}
              </span>
            )}
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#555' }}>{mensajes.length} mensajes · {noLeidos} sin leer</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { value: 'todos', label: 'Todos' },
            { value: 'no_leido', label: 'Sin leer' },
            { value: 'leido', label: 'Leídos' },
          ].map(f => (
            <button key={f.value} onClick={() => setFiltro(f.value as any)}
              style={{ background: filtro === f.value ? '#C8102E' : 'transparent', color: filtro === f.value ? '#fff' : '#888', border: `1px solid ${filtro === f.value ? '#C8102E' : 'rgba(255,255,255,0.12)'}`, padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden', minHeight: '500px' }}>

        {/* LISTA */}
        <div style={{ background: '#141414', overflow: 'auto' }}>
          {filtrados.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#555', fontSize: '0.82rem' }}>
              No hay mensajes
            </div>
          )}
          {filtrados.map(m => (
            <div key={m.id} onClick={() => handleSelect(m)}
              style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: selected?.id === m.id ? '#1A1A1A' : 'transparent', borderLeft: `3px solid ${!m.leido ? '#C8102E' : 'transparent'}`, transition: 'background 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                <div style={{ fontWeight: m.leido ? 400 : 600, fontSize: '0.84rem', color: '#F0EEE8' }}>{m.nombre}</div>
                <div style={{ fontSize: '0.65rem', color: '#444', fontFamily: 'monospace', flexShrink: 0, marginLeft: '0.5rem' }}>
                  {new Date(m.created_at).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })}
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#555', marginBottom: '0.3rem', fontFamily: 'monospace' }}>{m.email}</div>
              {m.asunto && (
                <div style={{ fontSize: '0.75rem', color: '#F2A900', marginBottom: '0.3rem', letterSpacing: '0.04em' }}>{m.asunto}</div>
              )}
              <div style={{ fontSize: '0.78rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {m.mensaje}
              </div>
            </div>
          ))}
        </div>

        {/* DETALLE */}
        <div style={{ background: '#0D0D0D', padding: '2rem' }}>
          {!selected ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#333' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>✉</div>
              <div style={{ fontSize: '0.82rem' }}>Selecciona un mensaje para leerlo</div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#F0EEE8', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
                    {selected.asunto || 'Sin asunto'}
                  </h2>
                  <div style={{ fontSize: '0.72rem', color: '#555' }}>
                    {new Date(selected.created_at).toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <button onClick={() => handleDelete(selected.id)}
                  style={{ background: 'transparent', border: '1px solid rgba(200,16,46,0.25)', color: '#C8102E', padding: '0.4rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                  ✕ Eliminar
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.3rem' }}>Nombre</div>
                  <div style={{ fontSize: '0.88rem', color: '#F0EEE8', fontWeight: 500 }}>{selected.nombre}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.3rem' }}>Email</div>
                  <a href={`mailto:${selected.email}`} style={{ fontSize: '0.88rem', color: '#F2A900', textDecoration: 'none', fontFamily: 'monospace' }}>{selected.email}</a>
                </div>
                {selected.telefono && (
                  <div>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.3rem' }}>Teléfono</div>
                    <div style={{ fontSize: '0.88rem', color: '#F0EEE8' }}>{selected.telefono}</div>
                  </div>
                )}
                {selected.asunto && (
                  <div>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.3rem' }}>Asunto</div>
                    <div style={{ fontSize: '0.88rem', color: '#F0EEE8' }}>{selected.asunto}</div>
                  </div>
                )}
              </div>

              <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.75rem' }}>Mensaje</div>
              <div style={{ fontSize: '0.92rem', color: 'rgba(250,250,248,0.7)', lineHeight: 1.8, whiteSpace: 'pre-wrap', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '1.5rem' }}>
                {selected.mensaje}
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.asunto || 'Tu mensaje a FEBORA'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#C8102E', color: '#fff', padding: '0.7rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  ✉ Responder por email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {msg && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: '#141414', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.85rem 1.25rem', fontSize: '0.82rem', color: '#F0EEE8', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          {msg}
        </div>
      )}
    </AdminLayout>
  )
}
