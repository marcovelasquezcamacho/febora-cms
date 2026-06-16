'use client'
import { useEffect, useState, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

const emptyForm = {
  titulo: '', contenido: '', imagen_url: '',
  btn_label: '', btn_url: '', tipo: 'info',
  activo: true, mostrar_una_vez: false,
  fecha_inicio: '', fecha_fin: ''
}

const tipos = [
  { value: 'info',       label: 'Información', color: '#7EA8E5' },
  { value: 'alerta',     label: 'Alerta',      color: '#ff7a85' },
  { value: 'invitacion', label: 'Invitación',  color: '#4CAF7D' },
  { value: 'comunicado', label: 'Comunicado',  color: '#F2A900' },
]

export default function PopupsPage() {
  const [popups, setPopups] = useState<any[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadPopups() }, [])

  const loadPopups = async () => {
    try {
      const { data } = await api.get('/api/popups/admin')
      setPopups(data)
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
      setForm(prev => ({ ...prev, imagen_url: `http://127.0.0.1:8000${data.url}` }))
      notify('Imagen subida correctamente')
    } catch {
      notify('Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        ...form,
        fecha_inicio: form.fecha_inicio || null,
        fecha_fin: form.fecha_fin || null,
      }
      if (editId) {
        await api.put(`/api/popups/${editId}`, payload)
        notify('Popup actualizado correctamente')
      } else {
        await api.post('/api/popups/', payload)
        notify('Popup creado correctamente')
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      loadPopups()
    } catch {
      notify('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (p: any) => {
    setForm({
      ...emptyForm, ...p,
      fecha_inicio: p.fecha_inicio ? p.fecha_inicio.substring(0, 16) : '',
      fecha_fin: p.fecha_fin ? p.fecha_fin.substring(0, 16) : '',
    })
    setEditId(p.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este popup?')) return
    try {
      await api.delete(`/api/popups/${id}`)
      notify('Popup eliminado')
      loadPopups()
    } catch { notify('Error al eliminar') }
  }

  const toggleActivo = async (p: any) => {
    try {
      await api.put(`/api/popups/${p.id}`, { ...p, activo: !p.activo })
      notify(p.activo ? 'Popup desactivado' : 'Popup activado')
      loadPopups()
    } catch {}
  }

  const inp = (style = {}) => ({
    width: '100%', background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.12)',
    color: '#F0EEE8', padding: '0.6rem 0.8rem', borderRadius: '6px',
    fontSize: '0.84rem', fontFamily: 'system-ui', boxSizing: 'border-box' as const,
    outline: 'none', ...style
  })

  const lbl = { display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#555', marginBottom: '0.35rem' }

  const tipoInfo = (tipo: string) => tipos.find(t => t.value === tipo) || tipos[0]

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.2rem' }}>POPUPS</h1>
          <p style={{ fontSize: '0.78rem', color: '#555' }}>Comunicados, invitaciones y alertas emergentes</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
          style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
          + Nuevo popup
        </button>
      </div>

      {/* LISTA DE POPUPS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
        {popups.map(p => {
          const t = tipoInfo(p.tipo)
          return (
            <div key={p.id} style={{ background: '#141414', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '1.25rem', alignItems: 'center' }}>

              {/* TIPO */}
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.25rem 0.65rem', borderRadius: '2px', background: `${t.color}20`, color: t.color, border: `1px solid ${t.color}50`, whiteSpace: 'nowrap' }}>
                {t.label}
              </span>

              {/* INFO */}
              <div>
                <div style={{ color: '#F0EEE8', fontWeight: 500, fontSize: '0.88rem', marginBottom: '0.2rem' }}>{p.titulo}</div>
                <div style={{ color: '#555', fontSize: '0.72rem' }}>
                  {p.contenido?.substring(0, 80)}{p.contenido?.length > 80 ? '...' : ''}
                  {p.fecha_inicio && <span style={{ marginLeft: '0.75rem', color: '#444' }}>Desde: {new Date(p.fecha_inicio).toLocaleDateString('es-BO')}</span>}
                  {p.fecha_fin && <span style={{ marginLeft: '0.5rem', color: '#444' }}>Hasta: {new Date(p.fecha_fin).toLocaleDateString('es-BO')}</span>}
                </div>
              </div>

              {/* ESTADO */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.55rem', borderRadius: '2px', background: p.activo ? 'rgba(0,122,51,0.15)' : 'rgba(255,255,255,0.05)', color: p.activo ? '#4CAF7D' : '#555', border: `1px solid ${p.activo ? 'rgba(0,122,51,0.25)' : 'rgba(255,255,255,0.08)'}` }}>
                  {p.activo ? 'Activo' : 'Inactivo'}
                </span>
                {p.mostrar_una_vez && (
                  <span style={{ fontSize: '0.62rem', padding: '0.2rem 0.55rem', borderRadius: '2px', background: 'rgba(242,169,0,0.1)', color: '#F2A900', border: '1px solid rgba(242,169,0,0.2)' }}>
                    1 vez
                  </span>
                )}
              </div>

              {/* ACCIONES */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => toggleActivo(p)} title={p.activo ? 'Desactivar' : 'Activar'}
                  style={{ width: '28px', height: '28px', background: 'transparent', border: `1px solid ${p.activo ? 'rgba(0,122,51,0.3)' : 'rgba(255,255,255,0.12)'}`, color: p.activo ? '#4CAF7D' : '#555', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                  {p.activo ? '●' : '○'}
                </button>
                <button onClick={() => handleEdit(p)} style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>✎</button>
                <button onClick={() => handleDelete(p.id)} style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(200,16,46,0.25)', color: '#C8102E', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
              </div>
            </div>
          )
        })}
        {popups.length === 0 && (
          <div style={{ background: '#141414', padding: '3rem', textAlign: 'center', color: '#555', fontSize: '0.82rem' }}>
            No hay popups creados
          </div>
        )}
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#F0EEE8', letterSpacing: '0.06em' }}>
                {editId ? 'EDITAR POPUP' : 'NUEVO POPUP'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

              {/* TIPO */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Tipo de popup</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {tipos.map(t => (
                    <button key={t.value} onClick={() => setForm({ ...form, tipo: t.value })}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.06em', border: `1px solid ${form.tipo === t.value ? t.color : 'rgba(255,255,255,0.1)'}`, background: form.tipo === t.value ? `${t.color}20` : 'transparent', color: form.tipo === t.value ? t.color : '#555', transition: 'all 0.15s' }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TÍTULO */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Título</label>
                <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} style={inp()}/>
              </div>

              {/* CONTENIDO */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Contenido / Mensaje</label>
                <textarea value={form.contenido} onChange={e => setForm({ ...form, contenido: e.target.value })}
                  style={{ ...inp(), minHeight: '90px', resize: 'vertical' as const }}/>
              </div>

              {/* IMAGEN */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Imagen (opcional)</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {form.imagen_url && (
                    <img src={form.imagen_url} alt="preview" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}/>
                  )}
                  <div style={{ flex: 1 }}>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }}/>
                    <button onClick={() => fileRef.current?.click()} disabled={uploading}
                      style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.15)', color: '#888', padding: '0.45rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', marginBottom: '0.5rem', width: '100%' }}>
                      {uploading ? 'Subiendo...' : '↑ Subir imagen'}
                    </button>
                    <input value={form.imagen_url} onChange={e => setForm({ ...form, imagen_url: e.target.value })}
                      placeholder="O pega una URL" style={inp({ fontSize: '0.75rem' })}/>
                  </div>
                </div>
              </div>

              {/* BOTÓN */}
              <div>
                <label style={lbl}>Texto del botón</label>
                <input value={form.btn_label} onChange={e => setForm({ ...form, btn_label: e.target.value })} placeholder="Ver más" style={inp()}/>
              </div>
              <div>
                <label style={lbl}>URL del botón</label>
                <input value={form.btn_url} onChange={e => setForm({ ...form, btn_url: e.target.value })} placeholder="#seccion o https://..." style={inp()}/>
              </div>

              {/* FECHAS */}
              <div>
                <label style={lbl}>Fecha inicio (opcional)</label>
                <input type="datetime-local" value={form.fecha_inicio} onChange={e => setForm({ ...form, fecha_inicio: e.target.value })}
                  style={{ ...inp(), colorScheme: 'dark' }}/>
              </div>
              <div>
                <label style={lbl}>Fecha fin (opcional)</label>
                <input type="datetime-local" value={form.fecha_fin} onChange={e => setForm({ ...form, fecha_fin: e.target.value })}
                  style={{ ...inp(), colorScheme: 'dark' }}/>
              </div>

              {/* OPCIONES */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" checked={form.activo} onChange={e => setForm({ ...form, activo: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#007A33' }}/>
                <label style={{ ...lbl, marginBottom: 0 }}>Popup activo</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" checked={form.mostrar_una_vez} onChange={e => setForm({ ...form, mostrar_una_vez: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#F2A900' }}/>
                <label style={{ ...lbl, marginBottom: 0 }}>Mostrar solo una vez</label>
              </div>

            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={loading} style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear popup'}
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
