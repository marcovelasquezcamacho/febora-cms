'use client'
import { useEffect, useState, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

const emptyForm = {
  nombre: '', apellido: '', iniciales: '', ranking_etiqueta: '',
  ranking_color: '#F2A900', tag_texto: '', tag_color: 'red',
  descripcion_corta: '', biografia: '', foto_url: '',
  nacionalidad: 'Bolivia', orden: 0, activo: true
}

export default function JugadoresPage() {
  const [jugadores, setJugadores] = useState<any[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadJugadores() }, [])

  const loadJugadores = async () => {
    try {
      const { data } = await api.get('/api/jugadores/admin')
      setJugadores(data)
    } catch {}
  }

  const notify = (text: string) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const fullUrl = `http://127.0.0.1:8000${data.url}`
      setForm(prev => ({ ...prev, foto_url: fullUrl }))
      notify('Foto subida correctamente')
    } catch {
      notify('Error al subir la foto')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (editId) {
        await api.put(`/api/jugadores/${editId}`, form)
        notify('Jugador actualizado correctamente')
      } else {
        await api.post('/api/jugadores/', form)
        notify('Jugador creado correctamente')
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      loadJugadores()
    } catch {
      notify('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (j: any) => {
    setForm({ ...emptyForm, ...j })
    setEditId(j.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este jugador?')) return
    try {
      await api.delete(`/api/jugadores/${id}`)
      notify('Jugador eliminado')
      loadJugadores()
    } catch { notify('Error al eliminar') }
  }

  const inp = (style = {}) => ({
    width: '100%', background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.12)',
    color: '#F0EEE8', padding: '0.6rem 0.8rem', borderRadius: '6px',
    fontSize: '0.84rem', fontFamily: 'system-ui', boxSizing: 'border-box' as const,
    outline: 'none', ...style
  })

  const lbl = { display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#555', marginBottom: '0.35rem' }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.2rem' }}>JUGADORES</h1>
          <p style={{ fontSize: '0.78rem', color: '#555' }}>Gestión de la selección nacional</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
          style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em' }}>
          + Nuevo jugador
        </button>
      </div>

      {/* TABLA */}
      <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Foto', 'Jugador', 'Iniciales', 'Ranking', 'Estado', 'Orden', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jugadores.map(j => (
              <tr key={j.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: 'linear-gradient(145deg, #1a0508, #3d0f17)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {j.foto_url
                      ? <img src={j.foto_url} alt={j.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      : <span style={{ fontFamily: 'serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>{j.iniciales}</span>
                    }
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ color: '#F0EEE8', fontWeight: 500, fontSize: '0.84rem' }}>{j.nombre} {j.apellido}</div>
                  <div style={{ color: '#555', fontSize: '0.72rem', marginTop: '0.1rem' }}>{j.nacionalidad}</div>
                </td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'serif', fontSize: '1.1rem', color: '#555' }}>{j.iniciales}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.55rem', borderRadius: '2px', background: 'rgba(242,169,0,0.15)', color: '#F2A900', border: '1px solid rgba(242,169,0,0.25)' }}>
                    {j.ranking_etiqueta}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.55rem', borderRadius: '2px', background: j.activo ? 'rgba(0,122,51,0.15)' : 'rgba(200,16,46,0.15)', color: j.activo ? '#4CAF7D' : '#ff7a85', border: `1px solid ${j.activo ? 'rgba(0,122,51,0.25)' : 'rgba(200,16,46,0.25)'}` }}>
                    {j.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#555', fontSize: '0.82rem', fontFamily: 'monospace' }}>{j.orden}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => handleEdit(j)} style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>✎</button>
                    <button onClick={() => handleDelete(j.id)} style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(200,16,46,0.25)', color: '#C8102E', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
            {jugadores.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#555', fontSize: '0.82rem' }}>No hay jugadores registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#F0EEE8', letterSpacing: '0.06em' }}>
                {editId ? 'EDITAR JUGADOR' : 'NUEVO JUGADOR'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            {/* FOTO */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={lbl}>Foto del jugador</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(145deg, #1a0508, #3d0f17)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {form.foto_url
                    ? <img src={form.foto_url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    : <span style={{ fontFamily: 'serif', fontSize: '1.5rem', color: 'rgba(255,255,255,0.15)' }}>{form.iniciales || '?'}</span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }}/>
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.15)', color: '#888', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', marginBottom: '0.5rem', width: '100%' }}>
                    {uploading ? 'Subiendo...' : '↑ Seleccionar foto'}
                  </button>
                  <input value={form.foto_url} onChange={e => setForm({ ...form, foto_url: e.target.value })}
                    placeholder="O pega una URL de imagen" style={inp({ fontSize: '0.75rem' })}/>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[['nombre', 'Nombre'], ['apellido', 'Apellido'], ['iniciales', 'Iniciales'], ['nacionalidad', 'Nacionalidad'], ['ranking_etiqueta', 'Ranking etiqueta'], ['tag_texto', 'Tag texto']].map(([key, label]) => (
                <div key={key} style={{ gridColumn: key === 'ranking_etiqueta' ? '1/-1' : 'auto' }}>
                  <label style={lbl}>{label}</label>
                  <input value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inp()}/>
                </div>
              ))}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Descripción corta</label>
                <textarea value={form.descripcion_corta} onChange={e => setForm({ ...form, descripcion_corta: e.target.value })}
                  style={{ ...inp(), minHeight: '80px', resize: 'vertical' as const }}/>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Biografía</label>
                <textarea value={form.biografia} onChange={e => setForm({ ...form, biografia: e.target.value })}
                  style={{ ...inp(), minHeight: '80px', resize: 'vertical' as const }}/>
              </div>
              <div>
                <label style={lbl}>Orden</label>
                <input type="number" value={form.orden} onChange={e => setForm({ ...form, orden: parseInt(e.target.value) })} style={inp()}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.2rem' }}>
                <input type="checkbox" checked={form.activo} onChange={e => setForm({ ...form, activo: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#007A33' }}/>
                <label style={{ ...lbl, marginBottom: 0 }}>Jugador activo</label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={loading} style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear jugador'}
              </button>
            </div>
          </div>
        </div>
      )}

      {msg && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: '#141414', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.85rem 1.25rem', fontSize: '0.82rem', color: '#F0EEE8', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          {msg}
        </div>
      )}
    </AdminLayout>
  )
}
