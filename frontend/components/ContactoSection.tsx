'use client'
import { useState } from 'react'
import { useResponsive } from '@/lib/useResponsive'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://febora-cms-production.up.railway.app'

const asuntos = [
  'Información general', 'Afiliación departamental', 'Torneos y competencias',
  'Selección nacional', 'Patrocinio y sponsors', 'Medios de comunicación', 'Otro',
]

export default function ContactoSection() {
  const { isMobile, isTablet } = useResponsive()
  const pad = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2.5rem' : '7rem 4rem'
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' })
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.mensaje) { setError('Por favor completa los campos obligatorios.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/api/contacto/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      setEnviado(true)
      setForm({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' })
    } catch { setError('Hubo un problema al enviar el mensaje. Intenta nuevamente.') }
    finally { setLoading(false) }
  }

  const inp = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#F0EEE8', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' as const, outline: 'none' }
  const lbl = { display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#555', marginBottom: '0.4rem' }

  return (
    <section id="contacto" style={{ background: '#141414', padding: pad, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', gap: isMobile ? '3rem' : '5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>Contáctanos
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '2.5rem' : 'clamp(2.5rem, 4vw, 3.5rem)', letterSpacing: '0.04em', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            ESTAMOS<br/><span style={{ color: '#C8102E' }}>AQUÍ</span><br/>PARA TI
          </h2>
          <p style={{ fontSize: '0.92rem', fontWeight: 300, color: 'rgba(250,250,248,0.55)', lineHeight: 1.8, marginBottom: '2rem' }}>
            ¿Tienes preguntas sobre afiliación, torneos o la selección nacional? Escríbenos y te responderemos a la brevedad.
          </p>
          {[{ icon: '📧', label: 'Email', value: 'contacto@febora.bo' }, { icon: '📍', label: 'Sede', value: 'La Paz, Bolivia' }, { icon: '🌐', label: 'Web', value: 'www.febora.bo' }].map(item => (
            <div key={item.label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.2rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.88rem', color: 'rgba(250,250,248,0.7)' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: isMobile ? '1.5rem' : '2.5rem' }}>
          {enviado ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontFamily: "'Bebas Neue', serif", fontSize: '1.8rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.75rem' }}>MENSAJE ENVIADO</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(250,250,248,0.5)', lineHeight: 1.7, marginBottom: '2rem' }}>Gracias por contactarnos. Te responderemos a la brevedad.</p>
              <button onClick={() => setEnviado(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#888', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>Enviar otro mensaje</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div><label style={lbl}>Nombre *</label><input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre completo" style={inp}/></div>
                <div><label style={lbl}>Email *</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" style={inp}/></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div><label style={lbl}>Teléfono</label><input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="+591 7..." style={inp}/></div>
                <div><label style={lbl}>Asunto</label>
                  <select value={form.asunto} onChange={e => setForm({ ...form, asunto: e.target.value })} style={{ ...inp, cursor: 'pointer' }}>
                    <option value="">Selecciona un asunto</option>
                    {asuntos.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={lbl}>Mensaje *</label>
                <textarea value={form.mensaje} onChange={e => setForm({ ...form, mensaje: e.target.value })} placeholder="Escribe tu mensaje aquí..." rows={5} style={{ ...inp, resize: 'vertical' as const, minHeight: '120px', lineHeight: 1.7 }}/>
              </div>
              {error && <div style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#ff7a85' }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#555' : '#C8102E', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                {loading ? 'Enviando...' : 'Enviar mensaje →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
