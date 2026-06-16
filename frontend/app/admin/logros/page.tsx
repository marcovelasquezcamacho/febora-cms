'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

const emptyForm = {
  icono: '', numero: '', descripcion: '',
  color_acento: 'rojo', numero_orden: 0, visible: true
}

export default function LogrosPage() {
  const [logros, setLogros] = useState<any[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadLogros() }, [])

  const loadLogros = async () => {
    try {
      const { data } = await api.get('/api/logros/admin')
      setLogros(data)
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
        await api.put(`/api/logros/${editId}`, form)
        notify('Logro actualizado correctamente')
      } else {
        await api.post('/api/logros/', form)
        notify('Logro creado correctamente')
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      loadLogros()
    } catch {
      notify('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (l: any) => {
    setForm({ ...emptyForm, ...l })
    setEditId(l.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este logro?')) return
    try {
      await api.delete(`/api/logros/${id}`)
      notify('Logro eliminado')
      loadLogros()
    } catch { notify('Error al eliminar') }
  }

  const inp = (style = {}) => ({
    width: '100%', background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.12)',
    color: '#F0EEE8', padding: '0.6rem 0.8rem', borderRadius: '6px',
    fontSize: '0.84rem', fontFamily: 'system-ui', boxSizing: 'border-box' as const,
    outline: 'none', ...style
  })

  const lbl = { display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#555', marginBottom: '0.35rem' }

  const acentos: Record<string, string> = {
    rojo: '#C8102E', amarillo: '#F2A900', verde: '#007A33'
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.2rem' }}>LOGROS</h1>
          <p style={{ fontSize: '0.78rem', color: '#555' }}>Tarjetas de logros institucionales</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
          style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em' }}>
          + Nuevo logro
        </button>
      </div>

      {/* GRID DE LOGROS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '1.5rem' }}>
        {logros.map(l => (
          <div key={l.id} style={{
            background: '#141414', padding: '2rem', position: 'relative',
            borderLeft: `3px solid ${acentos[l.color_acento] || '#C8102E'}`
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{l.icono}</div>
            <div style={{ fontFamily: 'serif', fontSize: '2.5rem', lineHeight: 1, color: '#F0EEE8', marginBottom: '0.4rem' }}>{l.numero}</div>
            <div style={{ fontSize: '0.78rem', color: '#555', lineHeight: 1.6, marginBottom: '1rem' }}>{l.descripcion}</div>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.55rem', borderRadius: '2px', background: l.visible ? 'rgba(0,122,51,0.15)' : 'rgba(255,255,255,0.05)', color: l.visible ? '#4CAF7D' : '#555', border: `1px solid ${l.visible ? 'rgba(0,122,51,0.25)' : 'rgba(255,255,255,0.1)'}` }}>
                {l.visible ? 'Visible' : 'Oculto'}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#555', fontFamily: 'monospace' }}>#{l.numero_orden}</span>
            </div>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.4rem' }}>
              <button onClick={() => handleEdit(l)} style={{ width: '26px', height: '26px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem' }}>✎</button>
              <button onClick={() => handleDelete(l.id)} style={{ width: '26px', height: '26px', background: 'transparent', border: '1px solid rgba(200,16,46,0.25)', color: '#C8102E', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem' }}>✕</button>
            </div>
          </div>
        ))}
        {logros.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center', color: '#555', fontSize: '0.82rem', background: '#141414' }}>
            No hay logros registrados
          </div>
        )}
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#F0EEE8', letterSpacing: '0.06em' }}>
                {editId ? 'EDITAR LOGRO' : 'NUEVO LOGRO'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={lbl}>Ícono (emoji)</label>
                <input value={form.icono} onChange={e => setForm({ ...form, icono: e.target.value })} placeholder="🏆" style={inp()}/>
              </div>
              <div>
                <label style={lbl}>Número / Valor</label>
                <input value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} placeholder="TOP 5" style={inp()}/>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  style={{ ...inp(), minHeight: '80px', resize: 'vertical' as const }}/>
              </div>
              <div>
                <label style={lbl}>Color acento</label>
                <select value={form.color_acento} onChange={e => setForm({ ...form, color_acento: e.target.value })}
                  style={{ ...inp(), cursor: 'pointer' }}>
                  <option value="rojo">Rojo</option>
                  <option value="amarillo">Amarillo</option>
                  <option value="verde">Verde</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Orden</label>
                <input type="number" value={form.numero_orden} onChange={e => setForm({ ...form, numero_orden: parseInt(e.target.value) })} style={inp()}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.2rem' }}>
                <input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#007A33' }}/>
                <label style={{ ...lbl, marginBottom: 0 }}>Visible en la landing</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={loading} style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear logro'}
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
