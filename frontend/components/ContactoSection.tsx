'use client'
import { useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://febora-cms-production.up.railway.app'

const asuntos = [
  'Información general',
  'Afiliación departamental',
  'Torneos y competencias',
  'Selección nacional',
  'Patrocinio y sponsors',
  'Medios de comunicación',
  'Otro',
]

export default function ContactoSection() {
  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '', asunto: '', mensaje: ''
  })
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.mensaje) {
      setError('Por favor completa los campos obligatorios.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/contacto/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setEnviado(true)
      setForm({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' })
    } catch {
      setError('Hubo un problema al enviar el mensaje. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)', color: '#F0EEE8',
    padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.88rem',
    fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' as const,
    outline: 'none', transition: 'border-color 0.2s',
  }

  const lbl = {
    display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em',
    textTransform: 'uppercase' as const, color: '#555', marginBottom: '0.4rem'
  }

  return (
    <section id="contacto" style={{ background: '#141414', padding: '7rem 4rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem', maxWidth: '1100px', margin: '0 auto' }}>

        {/* INFO IZQUIERDA */}
        <div>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>
            Contáctanos
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', serif", fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', letterSpacing: '0.04em', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            ESTAMOS<br/><span style={{ color: '#C8102E' }}>AQUÍ</span><br/>PARA TI
          </h2>
          <p style={{ fontSize: '0.92rem', fontWeight: 300, color: 'rgba(250,250,248,0.55)', lineHeight: 1.8, marginBottom: '3rem' }}>
            ¿Tienes preguntas sobre afiliación, torneos o la selección nacional? Escríbenos y te responderemos a la brevedad posible.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: '📧', label: 'Email', value: 'contacto@febora.bo' },
              { icon: '📍', label: 'Sede', value: 'La Paz, Bolivia' },
              { icon: '🌐', label: 'Web', value: 'www.febora.bo' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.2rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.88rem', color: 'rgba(250,250,248,0.7)' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '3px' }}>
            <div style={{ background: '#C8102E', flex: 1, height: '3px', borderRadius: '1px 0 0 1px' }}/>
            <div style={{ background: '#F2A900', flex: 1, height: '3px' }}/>
            <div style={{ background: '#007A33', flex: 1, height: '3px', borderRadius: '0 1px 1px 0' }}/>
          </div>
        </div>

        {/* FORMULARIO */}
        <div style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '2.5rem' }}>

          {enviado ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontFamily: "'Bebas Neue', serif", fontSize: '1.8rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.75rem' }}>
                MENSAJE ENVIADO
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(250,250,248,0.5)', lineHeight: 1.7, marginBottom: '2rem' }}>
                Gracias por contactarnos. Te responderemos a la brevedad posible en el email proporcionado.
              </p>
              <button onClick={() => setEnviado(false)}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#888', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={lbl}>Nombre *</label>
                  <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Tu nombre completo" style={inp}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#C8102E'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}/>
                </div>
                <div>
                  <label style={lbl}>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="tu@email.com" style={inp}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#C8102E'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}/>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={lbl}>Teléfono</label>
                  <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })}
                    placeholder="+591 7..." style={inp}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#C8102E'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}/>
                </div>
                <div>
                  <label style={lbl}>Asunto</label>
                  <select value={form.asunto} onChange={e => setForm({ ...form, asunto: e.target.value })}
                    style={{ ...inp, cursor: 'pointer' }}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#C8102E'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}>
                    <option value="">Selecciona un asunto</option>
                    {asuntos.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={lbl}>Mensaje *</label>
                <textarea value={form.mensaje} onChange={e => setForm({ ...form, mensaje: e.target.value })}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={5} style={{ ...inp, resize: 'vertical' as const, minHeight: '130px', lineHeight: 1.7 }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#C8102E'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}/>
              </div>

              {error && (
                <div style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#ff7a85' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{ width: '100%', background: loading ? '#555' : '#C8102E', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', fontFamily: "'DM Sans', sans-serif" }}>
                {loading ? 'Enviando...' : 'Enviar mensaje →'}
              </button>

              <p style={{ fontSize: '0.7rem', color: '#444', textAlign: 'center', marginTop: '1rem', lineHeight: 1.6 }}>
                Los campos marcados con * son obligatorios. Tu información será tratada con confidencialidad.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
