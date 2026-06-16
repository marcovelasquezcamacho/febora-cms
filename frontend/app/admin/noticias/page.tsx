'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

const emptyForm = {
  titulo: '', categoria: '', categoria_color: 'red',
  resumen: '', contenido: '', imagen_url: '',
  destacada: false, publicada: false
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadNoticias() }, [])

  const loadNoticias = async () => {
    try {
      const { data } = await api.get('/api/noticias/admin')
      setNoticias(data)
    } catch {}
  }

  const notify = (text: string) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (editId) {
        await api.put(`/api/noticias/${editId}`, form)
        notify('Noticia actualizada correctamente')
      } else {
        await api.post('/api/noticias/', form)
        notify('Noticia creada correctamente')
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      loadNoticias()
    } catch {
      notify('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (n: any) => {
    setForm({ ...emptyForm, ...n })
    setEditId(n.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta noticia?')) return
    try {
      await api.delete(`/api/noticias/${id}`)
      notify('Noticia eliminada')
      loadNoticias()
    } catch { notify('Error al eliminar') }
  }

  const inp = (style = {}) => ({
    width: '100%', background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.12)',
    color: '#F0EEE8', padding: '0.6rem 0.8rem', borderRadius: '6px',
    fontSize: '0.84rem', fontFamily: 'system-ui', boxSizing: 'border-box' as const,
    outline: 'none', ...style
  })

  const lbl = { display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#555', marginBottom: '0.35rem' }

  const catColors: Record<string, string> = {
    red: '#ff6b7a', green: '#4CAF7D', yellow: '#F2A900'
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.2rem' }}>NOTICIAS</h1>
          <p style={{ fontSize: '0.78rem', color: '#555' }}>Publicaciones y artículos del sitio</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
          style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em' }}>
          + Nueva noticia
        </button>
      </div>

      {/* TABLA */}
      <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Título', 'Categoría', 'Destacada', 'Estado', 'Fecha', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {noticias.map(n => (
              <tr key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ color: '#F0EEE8', fontWeight: 500, fontSize: '0.84rem', maxWidth: '280px' }}>{n.titulo}</div>
                  <div style={{ color: '#555', fontSize: '0.7rem', marginTop: '0.1rem', fontFamily: 'monospace' }}>{n.slug}</div>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.55rem', borderRadius: '2px', background: 'rgba(200,16,46,0.15)', color: catColors[n.categoria_color] || '#ff6b7a', border: '1px solid rgba(200,16,46,0.25)' }}>
                    {n.categoria}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: n.destacada ? '#F2A900' : '#555', fontSize: '1rem' }}>
                  {n.destacada ? '★' : '☆'}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.55rem', borderRadius: '2px', background: n.publicada ? 'rgba(0,122,51,0.15)' : 'rgba(242,169,0,0.15)', color: n.publicada ? '#4CAF7D' : '#F2A900', border: `1px solid ${n.publicada ? 'rgba(0,122,51,0.25)' : 'rgba(242,169,0,0.25)'}` }}>
                    {n.publicada ? 'Publicada' : 'Borrador'}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#555', fontSize: '0.72rem', fontFamily: 'monospace' }}>
                  {n.fecha_publicacion ? new Date(n.fecha_publicacion).toLocaleDateString('es-BO') : '—'}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => handleEdit(n)} style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>✎</button>
                    <button onClick={() => handleDelete(n.id)} style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(200,16,46,0.25)', color: '#C8102E', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
            {noticias.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#555', fontSize: '0.82rem' }}>No hay noticias registradas</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#F0EEE8', letterSpacing: '0.06em' }}>
                {editId ? 'EDITAR NOTICIA' : 'NUEVA NOTICIA'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Título</label>
                <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} style={inp()}/>
              </div>
              <div>
                <label style={lbl}>Categoría</label>
                <input value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} style={inp()}/>
              </div>
              <div>
                <label style={lbl}>Color categoría</label>
                <select value={form.categoria_color} onChange={e => setForm({ ...form, categoria_color: e.target.value })}
                  style={{ ...inp(), cursor: 'pointer' }}>
                  <option value="red">Rojo</option>
                  <option value="green">Verde</option>
                  <option value="yellow">Amarillo</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Resumen</label>
                <textarea value={form.resumen} onChange={e => setForm({ ...form, resumen: e.target.value })}
                  style={{ ...inp(), minHeight: '70px', resize: 'vertical' as const }}/>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Contenido completo</label>
                <textarea value={form.contenido} onChange={e => setForm({ ...form, contenido: e.target.value })}
                  style={{ ...inp(), minHeight: '120px', resize: 'vertical' as const }}/>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>URL imagen</label>
                <input value={form.imagen_url} onChange={e => setForm({ ...form, imagen_url: e.target.value })} style={inp()}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" checked={form.destacada} onChange={e => setForm({ ...form, destacada: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#F2A900' }}/>
                <label style={{ ...lbl, marginBottom: 0 }}>Noticia destacada</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" checked={form.publicada} onChange={e => setForm({ ...form, publicada: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#007A33' }}/>
                <label style={{ ...lbl, marginBottom: 0 }}>Publicar ahora</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={loading} style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear noticia'}
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
