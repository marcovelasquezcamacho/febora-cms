'use client'
import { useEffect, useState, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

const emptyForm = {
  titulo: '', descripcion: '', imagen_url: '',
  categoria: 'general', orden: 0,
  destacada: false, visible: true
}

const categorias = [
  { value: 'general',       label: 'General' },
  { value: 'torneo',        label: 'Torneos' },
  { value: 'seleccion',     label: 'Selección' },
  { value: 'premiacion',    label: 'Premiación' },
  { value: 'entrenamiento', label: 'Entrenamiento' },
]

export default function GaleriaAdminPage() {
  const [fotos, setFotos] = useState<any[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadFotos() }, [])

  const loadFotos = async () => {
    try {
      const { data } = await api.get('/api/galeria/admin')
      setFotos(data)
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
      setForm(prev => ({ ...prev, imagen_url: data.url }))
      notify('Imagen subida correctamente')
    } catch {
      notify('Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.imagen_url) { notify('La imagen es obligatoria'); return }
    setLoading(true)
    try {
      if (editId) {
        await api.put(`/api/galeria/${editId}`, form)
        notify('Foto actualizada correctamente')
      } else {
        await api.post('/api/galeria/', form)
        notify('Foto añadida correctamente')
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      loadFotos()
    } catch {
      notify('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (f: any) => {
    setForm({ ...emptyForm, ...f })
    setEditId(f.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta foto?')) return
    try {
      await api.delete(`/api/galeria/${id}`)
      notify('Foto eliminada')
      loadFotos()
    } catch { notify('Error al eliminar') }
  }

  const toggleVisible = async (f: any) => {
    try {
      await api.put(`/api/galeria/${f.id}`, { ...f, visible: !f.visible })
      notify(f.visible ? 'Foto ocultada' : 'Foto visible')
      loadFotos()
    } catch {}
  }

  const toggleDestacada = async (f: any) => {
    try {
      await api.put(`/api/galeria/${f.id}`, { ...f, destacada: !f.destacada })
      notify(f.destacada ? 'Destacado removido' : 'Foto destacada')
      loadFotos()
    } catch {}
  }

  const inp = (style = {}) => ({
    width: '100%', background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.12)',
    color: '#F0EEE8', padding: '0.6rem 0.8rem', borderRadius: '6px',
    fontSize: '0.84rem', fontFamily: 'system-ui', boxSizing: 'border-box' as const,
    outline: 'none', ...style
  })

  const lbl = { display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#555', marginBottom: '0.35rem' }

  const catLabel = (val: string) => categorias.find(c => c.value === val)?.label || val

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.2rem' }}>GALERÍA</h1>
          <p style={{ fontSize: '0.78rem', color: '#555' }}>{fotos.length} fotos · {fotos.filter(f => f.visible).length} visibles</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
          style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
          + Añadir foto
        </button>
      </div>

      {/* GRID DE FOTOS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
        {fotos.map(f => (
          <div key={f.id} style={{ background: '#141414', position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
            <img src={f.imagen_url} alt={f.titulo}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: f.visible ? 1 : 0.35 }}/>

            {/* OVERLAY INFO */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)', padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.45rem', borderRadius: '2px', background: 'rgba(242,169,0,0.2)', color: '#F2A900', border: '1px solid rgba(242,169,0,0.3)' }}>
                  {catLabel(f.categoria)}
                </span>
                {f.destacada && (
                  <span style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.45rem', borderRadius: '2px', background: 'rgba(200,16,46,0.2)', color: '#ff7a85', border: '1px solid rgba(200,16,46,0.3)' }}>★</span>
                )}
              </div>
              {f.titulo && <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#F0EEE8', lineHeight: 1.3 }}>{f.titulo}</div>}
            </div>

            {/* ACCIONES */}
            <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.3rem', opacity: 0 }}
              className="foto-actions"
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}>
              <button onClick={() => toggleDestacada(f)} title="Destacar"
                style={{ width: '26px', height: '26px', background: f.destacada ? 'rgba(242,169,0,0.3)' : 'rgba(0,0,0,0.6)', border: `1px solid ${f.destacada ? 'rgba(242,169,0,0.5)' : 'rgba(255,255,255,0.2)'}`, color: f.destacada ? '#F2A900' : '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>★</button>
              <button onClick={() => toggleVisible(f)} title={f.visible ? 'Ocultar' : 'Mostrar'}
                style={{ width: '26px', height: '26px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: f.visible ? '#4CAF7D' : '#555', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
                {f.visible ? '●' : '○'}
              </button>
              <button onClick={() => handleEdit(f)} title="Editar"
                style={{ width: '26px', height: '26px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>✎</button>
              <button onClick={() => handleDelete(f.id)} title="Eliminar"
                style={{ width: '26px', height: '26px', background: 'rgba(200,16,46,0.3)', border: '1px solid rgba(200,16,46,0.4)', color: '#ff7a85', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>
            </div>

            {/* HOVER PARA MOSTRAR ACCIONES */}
            <style>{`.foto-actions { opacity: 0; transition: opacity 0.2s; } div:hover > .foto-actions { opacity: 1 !important; }`}</style>
          </div>
        ))}
        {fotos.length === 0 && (
          <div style={{ gridColumn: '1/-1', background: '#141414', padding: '4rem', textAlign: 'center', color: '#555', fontSize: '0.82rem' }}>
            No hay fotos en la galería. Añade la primera foto.
          </div>
        )}
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#F0EEE8', letterSpacing: '0.06em' }}>
                {editId ? 'EDITAR FOTO' : 'AÑADIR FOTO'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* IMAGEN */}
              <div>
                <label style={lbl}>Imagen *</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  {form.imagen_url && (
                    <img src={form.imagen_url} alt="preview"
                      style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}/>
                  )}
                  <div style={{ flex: 1 }}>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }}/>
                    <button onClick={() => fileRef.current?.click()} disabled={uploading}
                      style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.15)', color: '#F0EEE8', padding: '0.55rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', marginBottom: '0.5rem', width: '100%', fontWeight: 500 }}>
                      {uploading ? '↑ Subiendo...' : '↑ Subir imagen'}
                    </button>
                    <input value={form.imagen_url} onChange={e => setForm({ ...form, imagen_url: e.target.value })}
                      placeholder="O pega una URL" style={inp({ fontSize: '0.75rem' })}/>
                  </div>
                </div>
              </div>

              {/* TÍTULO */}
              <div>
                <label style={lbl}>Título</label>
                <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} style={inp()}/>
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label style={lbl}>Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  style={{ ...inp(), minHeight: '70px', resize: 'vertical' as const }}/>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* CATEGORÍA */}
                <div>
                  <label style={lbl}>Categoría</label>
                  <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}
                    style={{ ...inp(), cursor: 'pointer' }}>
                    {categorias.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                {/* ORDEN */}
                <div>
                  <label style={lbl}>Orden</label>
                  <input type="number" value={form.orden} onChange={e => setForm({ ...form, orden: parseInt(e.target.value) || 0 })} style={inp()}/>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <input type="checkbox" checked={form.destacada} onChange={e => setForm({ ...form, destacada: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#F2A900' }}/>
                  <label style={{ ...lbl, marginBottom: 0 }}>Foto destacada</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#007A33' }}/>
                  <label style={{ ...lbl, marginBottom: 0 }}>Visible en landing</label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={loading}
                style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Añadir foto'}
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
