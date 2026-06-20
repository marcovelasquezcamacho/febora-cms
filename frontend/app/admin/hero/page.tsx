'use client'
import { useEffect, useState, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

const emptyForm = {
  badge_texto: '', badge_color: '#F2A900',
  titulo_linea1: '', titulo_linea2: '', titulo_linea3: '',
  color_linea1: '#C8102E', color_linea2: '#FFFFFF', color_linea3: '#007A33',
  subtitulo: '', btn_primario_label: '', btn_primario_url: '',
  btn_secundario_label: '', btn_secundario_url: '',
  imagen_fondo_url: '', activo: true
}

export default function HeroAdminPage() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadHero() }, [])

  const loadHero = async () => {
    try {
      const { data } = await api.get('/api/hero/')
      setForm({ ...emptyForm, ...data })
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
      const fullUrl = data.url
      setForm(prev => ({ ...prev, imagen_fondo_url: fullUrl }))
      notify('Imagen subida correctamente')
    } catch {
      notify('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.put('/api/hero/', form)
      notify('Hero actualizado correctamente')
    } catch {
      notify('Error al guardar')
    } finally {
      setLoading(false)
    }
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
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.2rem' }}>HERO PRINCIPAL</h1>
          <p style={{ fontSize: '0.78rem', color: '#555' }}>Imagen y textos del banner principal</p>
        </div>
        <button onClick={handleSave} disabled={loading}
          style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* IMAGEN DESTACADA */}
        <div style={{ gridColumn: '1/-1', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Imagen de fondo destacada</div>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <div style={{ aspectRatio: '16/9', background: '#0B0B0B', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {form.imagen_fondo_url
                ? <img src={form.imagen_fondo_url} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                : <div style={{ textAlign: 'center', color: '#333' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼</div>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>Sin imagen</div>
                  </div>
              }
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }}/>
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.15)', color: '#F0EEE8', padding: '0.7rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '0.75rem', width: '100%', fontWeight: 500 }}>
                {uploading ? '↑ Subiendo imagen...' : '↑ Subir imagen de fondo'}
              </button>
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={lbl}>O pega una URL de imagen</label>
                <input value={form.imagen_fondo_url} onChange={e => setForm({ ...form, imagen_fondo_url: e.target.value })}
                  placeholder="https://..." style={inp()}/>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#444', lineHeight: 1.6 }}>
                Formatos: JPG, PNG, WebP — Máximo 5MB<br/>
                Recomendado: 1920×1080px o superior
              </div>
              {form.imagen_fondo_url && (
                <button onClick={() => setForm({ ...form, imagen_fondo_url: '' })}
                  style={{ background: 'transparent', border: '1px solid rgba(200,16,46,0.25)', color: '#C8102E', padding: '0.4rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', marginTop: '0.75rem' }}>
                  ✕ Quitar imagen
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BADGE */}
        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Badge superior</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={lbl}>Texto</label>
              <input value={form.badge_texto} onChange={e => setForm({ ...form, badge_texto: e.target.value })} style={inp()}/>
            </div>
          </div>
        </div>

        {/* TÍTULO */}
        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Título — 3 líneas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              ['titulo_linea1', 'color_linea1', 'Línea 1'],
              ['titulo_linea2', 'color_linea2', 'Línea 2'],
              ['titulo_linea3', 'color_linea3', 'Línea 3'],
            ].map(([textKey, colorKey, label]) => (
              <div key={textKey} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                <div>
                  <label style={lbl}>{label}</label>
                  <input value={(form as any)[textKey]} onChange={e => setForm({ ...form, [textKey]: e.target.value })} style={inp()}/>
                </div>
                <div>
                  <label style={lbl}>Color</label>
                  <input type="color" value={(form as any)[colorKey]} onChange={e => setForm({ ...form, [colorKey]: e.target.value })}
                    style={{ width: '44px', height: '38px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', background: '#1C1C1C', cursor: 'pointer', padding: '2px' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBTÍTULO */}
        <div style={{ gridColumn: '1/-1', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Subtítulo</div>
          <textarea value={form.subtitulo} onChange={e => setForm({ ...form, subtitulo: e.target.value })}
            style={{ ...inp(), minHeight: '80px', resize: 'vertical' as const }}/>
        </div>

        {/* BOTONES */}
        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Botón primario</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={lbl}>Texto</label>
              <input value={form.btn_primario_label} onChange={e => setForm({ ...form, btn_primario_label: e.target.value })} style={inp()}/>
            </div>
            <div>
              <label style={lbl}>URL</label>
              <input value={form.btn_primario_url} onChange={e => setForm({ ...form, btn_primario_url: e.target.value })} style={inp()}/>
            </div>
          </div>
        </div>

        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Botón secundario</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={lbl}>Texto</label>
              <input value={form.btn_secundario_label} onChange={e => setForm({ ...form, btn_secundario_label: e.target.value })} style={inp()}/>
            </div>
            <div>
              <label style={lbl}>URL</label>
              <input value={form.btn_secundario_url} onChange={e => setForm({ ...form, btn_secundario_url: e.target.value })} style={inp()}/>
            </div>
          </div>
        </div>

        {/* PREVIEW */}
        <div style={{ gridColumn: '1/-1', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Vista previa</div>
          <div style={{ background: '#0B0B0B', borderRadius: '8px', padding: '3rem 2rem', position: 'relative', overflow: 'hidden', minHeight: '220px', display: 'flex', alignItems: 'center' }}>
            {form.imagen_fondo_url && (
              <img src={form.imagen_fondo_url} alt="bg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}/>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(200,16,46,0.18) 0%, transparent 60%)' }}/>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#C8102E', flex: 1 }}/><div style={{ background: '#F2A900', flex: 1 }}/><div style={{ background: '#007A33', flex: 1 }}/>
            </div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              {form.badge_texto && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F2A900', border: '1px solid rgba(242,169,0,0.35)', padding: '0.3rem 0.75rem', borderRadius: '2px', marginBottom: '0.75rem' }}>
                  <span style={{ width: '5px', height: '5px', background: '#F2A900', borderRadius: '50%', display: 'inline-block' }}/>{form.badge_texto}
                </div>
              )}
              <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: '3rem', lineHeight: 0.95, letterSpacing: '0.02em' }}>
                <span style={{ color: form.color_linea1, display: 'block' }}>{form.titulo_linea1 || 'LÍNEA 1'}</span>
                <span style={{ color: form.color_linea2, display: 'block' }}>{form.titulo_linea2 || 'LÍNEA 2'}</span>
                <span style={{ color: form.color_linea3, display: 'block' }}>{form.titulo_linea3 || 'LÍNEA 3'}</span>
              </div>
              {form.subtitulo && (
                <p style={{ fontSize: '0.8rem', color: 'rgba(250,250,248,0.55)', maxWidth: '400px', lineHeight: 1.6, marginTop: '0.75rem', fontWeight: 300 }}>{form.subtitulo.substring(0, 100)}...</p>
              )}
            </div>
          </div>
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
