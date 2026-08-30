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
  const [imagenes, setImagenes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const fileImgRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadHero()
    loadImagenes()
  }, [])

  const loadHero = async () => {
    try {
      const { data } = await api.get('/api/hero/')
      setForm({ ...emptyForm, ...data })
    } catch {}
  }

  const loadImagenes = async () => {
    try {
      const { data } = await api.get('/api/hero/imagenes')
      setImagenes(data)
    } catch {}
  }

  const notify = (text: string) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleUploadFondo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setForm(prev => ({ ...prev, imagen_fondo_url: data.url }))
      notify('Imagen subida correctamente')
    } catch { notify('Error al subir') }
    finally { setUploading(false) }
  }

  const handleUploadCarrusel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (imagenes.length >= 5) { notify('Máximo 5 imágenes permitidas'); return }
    setUploadingImg(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data: mediaData } = await api.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await api.post('/api/hero/imagenes', {
        imagen_url: mediaData.url,
        orden: imagenes.length,
        activo: true
      })
      notify('Imagen del carrusel agregada')
      loadImagenes()
    } catch { notify('Error al subir imagen') }
    finally { setUploadingImg(false) }
  }

  const handleDeleteImagen = async (id: string) => {
    if (!confirm('¿Eliminar esta imagen del carrusel?')) return
    try {
      await api.delete(`/api/hero/imagenes/${id}`)
      notify('Imagen eliminada')
      loadImagenes()
    } catch { notify('Error al eliminar') }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.put('/api/hero/', form)
      notify('Hero actualizado correctamente')
    } catch { notify('Error al guardar') }
    finally { setLoading(false) }
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
          <p style={{ fontSize: '0.78rem', color: '#555' }}>Textos, colores e imágenes del banner principal</p>
        </div>
        <button onClick={handleSave} disabled={loading}
          style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* CARRUSEL DE IMÁGENES */}
        <div style={{ gridColumn: '1/-1', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555' }}>Imágenes del carrusel</div>
              <div style={{ fontSize: '0.72rem', color: '#444', marginTop: '0.2rem' }}>{imagenes.length}/5 imágenes — se rotan automáticamente cada 5 segundos</div>
            </div>
            {imagenes.length < 5 && (
              <>
                <input ref={fileImgRef} type="file" accept="image/*" onChange={handleUploadCarrusel} style={{ display: 'none' }}/>
                <button onClick={() => fileImgRef.current?.click()} disabled={uploadingImg}
                  style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.15)', color: '#F0EEE8', padding: '0.55rem 1.1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500 }}>
                  {uploadingImg ? '↑ Subiendo...' : '+ Agregar imagen'}
                </button>
              </>
            )}
          </div>

          {imagenes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', color: '#444', fontSize: '0.82rem' }}>
              No hay imágenes en el carrusel. Agrega hasta 5 imágenes.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
              {imagenes.map((img, i) => (
                <div key={img.id} style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={img.imagen_url} alt={`Imagen ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}>
                    <div style={{ background: '#C8102E', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontFamily: 'monospace' }}>{i+1}</div>
                    <button onClick={() => handleDeleteImagen(img.id)}
                      style={{ background: 'rgba(200,16,46,0.8)', border: 'none', color: '#fff', padding: '0.3rem 0.7rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>
                      Eliminar
                    </button>
                  </div>
                  <div style={{ position: 'absolute', top: '0.4rem', left: '0.4rem', background: 'rgba(0,0,0,0.6)', color: '#F2A900', fontSize: '0.6rem', padding: '0.15rem 0.4rem', borderRadius: '2px', fontFamily: 'monospace' }}>
                    {i+1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* IMAGEN DE FONDO (fallback) */}
        <div style={{ gridColumn: '1/-1', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.4rem' }}>Imagen de fondo fallback</div>
          <div style={{ fontSize: '0.72rem', color: '#444', marginBottom: '1rem' }}>Se usa cuando no hay imágenes en el carrusel</div>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <div style={{ aspectRatio: '16/9', background: '#0B0B0B', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {form.imagen_fondo_url
                ? <img src={form.imagen_fondo_url} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                : <div style={{ textAlign: 'center', color: '#333', fontSize: '0.72rem' }}>Sin imagen</div>
              }
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUploadFondo} style={{ display: 'none' }}/>
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.15)', color: '#F0EEE8', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', marginBottom: '0.5rem', width: '100%' }}>
                {uploading ? '↑ Subiendo...' : '↑ Subir imagen fallback'}
              </button>
              <input value={form.imagen_fondo_url} onChange={e => setForm({ ...form, imagen_fondo_url: e.target.value })}
                placeholder="O pega una URL" style={inp({ fontSize: '0.75rem' })}/>
            </div>
          </div>
        </div>

        {/* BADGE */}
        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Badge superior</div>
          <div>
            <label style={lbl}>Texto</label>
            <input value={form.badge_texto} onChange={e => setForm({ ...form, badge_texto: e.target.value })} style={inp()}/>
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
            style={{ ...inp(), minHeight: '70px', resize: 'vertical' as const }}/>
        </div>

        {/* BOTONES */}
        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Botón primario</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div><label style={lbl}>Texto</label><input value={form.btn_primario_label} onChange={e => setForm({ ...form, btn_primario_label: e.target.value })} style={inp()}/></div>
            <div><label style={lbl}>URL</label><input value={form.btn_primario_url} onChange={e => setForm({ ...form, btn_primario_url: e.target.value })} style={inp()}/></div>
          </div>
        </div>

        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Botón secundario</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div><label style={lbl}>Texto</label><input value={form.btn_secundario_label} onChange={e => setForm({ ...form, btn_secundario_label: e.target.value })} style={inp()}/></div>
            <div><label style={lbl}>URL</label><input value={form.btn_secundario_url} onChange={e => setForm({ ...form, btn_secundario_url: e.target.value })} style={inp()}/></div>
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
