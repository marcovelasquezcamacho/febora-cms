'use client'
import { useEffect, useState, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

const emptyForm = {
  nombre: '', logo_url: '', sitio_web: '',
  categoria: 'general', orden: 0, visible: true
}

const categorias = [
  { value: 'oro',     label: 'Oro',     color: '#F2A900' },
  { value: 'plata',   label: 'Plata',   color: '#B0B8C1' },
  { value: 'bronce',  label: 'Bronce',  color: '#CD7F32' },
  { value: 'general', label: 'General', color: '#888' },
]

export default function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState<any[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadSponsors() }, [])

  const loadSponsors = async () => {
    try {
      const { data } = await api.get('/api/sponsors/admin')
      setSponsors(data)
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
      setForm(prev => ({ ...prev, logo_url: data.url }))
      notify('Logo subido correctamente')
    } catch {
      notify('Error al subir logo')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.nombre) { notify('El nombre es obligatorio'); return }
    setLoading(true)
    try {
      if (editId) {
        await api.put(`/api/sponsors/${editId}`, form)
        notify('Sponsor actualizado')
      } else {
        await api.post('/api/sponsors/', form)
        notify('Sponsor creado correctamente')
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      loadSponsors()
    } catch {
      notify('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (s: any) => {
    setForm({ ...emptyForm, ...s })
    setEditId(s.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este sponsor?')) return
    try {
      await api.delete(`/api/sponsors/${id}`)
      notify('Sponsor eliminado')
      loadSponsors()
    } catch { notify('Error al eliminar') }
  }

  const toggleVisible = async (s: any) => {
    try {
      await api.put(`/api/sponsors/${s.id}`, { ...s, visible: !s.visible })
      notify(s.visible ? 'Sponsor ocultado' : 'Sponsor visible')
      loadSponsors()
    } catch {}
  }

  const inp = (style = {}) => ({
    width: '100%', background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.12)',
    color: '#F0EEE8', padding: '0.6rem 0.8rem', borderRadius: '6px',
    fontSize: '0.84rem', fontFamily: 'system-ui', boxSizing: 'border-box' as const,
    outline: 'none', ...style
  })

  const lbl = { display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#555', marginBottom: '0.35rem' }

  const catInfo = (val: string) => categorias.find(c => c.value === val) || categorias[3]

  const grupos: Record<string, any[]> = {}
  sponsors.forEach(s => {
    if (!grupos[s.categoria]) grupos[s.categoria] = []
    grupos[s.categoria].push(s)
  })

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.2rem' }}>SPONSORS</h1>
          <p style={{ fontSize: '0.78rem', color: '#555' }}>{sponsors.length} patrocinadores · {sponsors.filter(s => s.visible).length} visibles</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
          style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
          + Nuevo sponsor
        </button>
      </div>

      {/* GRUPOS POR CATEGORÍA */}
      {['oro', 'plata', 'bronce', 'general'].map(cat => {
        const lista = grupos[cat] || []
        if (lista.length === 0) return null
        const ci = catInfo(cat)
        return (
          <div key={cat} style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: ci.color, border: `1px solid ${ci.color}50`, padding: '0.25rem 0.7rem', borderRadius: '2px' }}>
                {ci.label}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#444' }}>{lista.length} sponsor{lista.length > 1 ? 's' : ''}</span>
            </div>
            <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Logo', 'Nombre', 'Sitio web', 'Estado', 'Orden', 'Acciones'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#444', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lista.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ width: '60px', height: '36px', background: '#1C1C1C', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                          {s.logo_url
                            ? <img src={s.logo_url} alt={s.nombre} style={{ maxWidth: '55px', maxHeight: '30px', objectFit: 'contain' }}/>
                            : <span style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.05em' }}>Sin logo</span>
                          }
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#F0EEE8', fontWeight: 500, fontSize: '0.84rem' }}>{s.nombre}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {s.sitio_web
                          ? <a href={s.sitio_web} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: '0.72rem', color: '#F2A900', textDecoration: 'none', fontFamily: 'monospace' }}>
                              {s.sitio_web.replace('https://', '').replace('http://', '')}
                            </a>
                          : <span style={{ color: '#444', fontSize: '0.72rem' }}>—</span>
                        }
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.55rem', borderRadius: '2px', background: s.visible ? 'rgba(0,122,51,0.15)' : 'rgba(255,255,255,0.05)', color: s.visible ? '#4CAF7D' : '#555', border: `1px solid ${s.visible ? 'rgba(0,122,51,0.25)' : 'rgba(255,255,255,0.08)'}` }}>
                          {s.visible ? 'Visible' : 'Oculto'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#444', fontSize: '0.8rem', fontFamily: 'monospace' }}>{s.orden}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => toggleVisible(s)} title={s.visible ? 'Ocultar' : 'Mostrar'}
                            style={{ width: '28px', height: '28px', background: 'transparent', border: `1px solid ${s.visible ? 'rgba(0,122,51,0.3)' : 'rgba(255,255,255,0.1)'}`, color: s.visible ? '#4CAF7D' : '#555', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                            {s.visible ? '●' : '○'}
                          </button>
                          <button onClick={() => handleEdit(s)}
                            style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>✎</button>
                          <button onClick={() => handleDelete(s.id)}
                            style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(200,16,46,0.25)', color: '#C8102E', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      {sponsors.length === 0 && (
        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '4rem', textAlign: 'center', color: '#555', fontSize: '0.82rem' }}>
          No hay sponsors registrados. Añade el primero.
        </div>
      )}

      {/* FORMULARIO */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#F0EEE8', letterSpacing: '0.06em' }}>
                {editId ? 'EDITAR SPONSOR' : 'NUEVO SPONSOR'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* CATEGORÍA */}
              <div>
                <label style={lbl}>Categoría</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {categorias.map(c => (
                    <button key={c.value} onClick={() => setForm({ ...form, categoria: c.value })}
                      style={{ padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500, border: `1px solid ${form.categoria === c.value ? c.color : 'rgba(255,255,255,0.1)'}`, background: form.categoria === c.value ? `${c.color}20` : 'transparent', color: form.categoria === c.value ? c.color : '#555', transition: 'all 0.15s' }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* NOMBRE */}
              <div>
                <label style={lbl}>Nombre del sponsor *</label>
                <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={inp()}/>
              </div>

              {/* LOGO */}
              <div>
                <label style={lbl}>Logo</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '50px', background: '#1C1C1C', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {form.logo_url
                      ? <img src={form.logo_url} alt="logo" style={{ maxWidth: '70px', maxHeight: '40px', objectFit: 'contain' }}/>
                      : <span style={{ fontSize: '0.6rem', color: '#444' }}>Sin logo</span>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }}/>
                    <button onClick={() => fileRef.current?.click()} disabled={uploading}
                      style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.15)', color: '#F0EEE8', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', marginBottom: '0.5rem', width: '100%', fontWeight: 500 }}>
                      {uploading ? '↑ Subiendo...' : '↑ Subir logo'}
                    </button>
                    <input value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })}
                      placeholder="O pega una URL" style={inp({ fontSize: '0.75rem' })}/>
                  </div>
                </div>
              </div>

              {/* SITIO WEB */}
              <div>
                <label style={lbl}>Sitio web</label>
                <input value={form.sitio_web} onChange={e => setForm({ ...form, sitio_web: e.target.value })}
                  placeholder="https://..." style={inp()}/>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={lbl}>Orden</label>
                  <input type="number" value={form.orden} onChange={e => setForm({ ...form, orden: parseInt(e.target.value) || 0 })} style={inp()}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingTop: '1.3rem' }}>
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
                {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear sponsor'}
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
