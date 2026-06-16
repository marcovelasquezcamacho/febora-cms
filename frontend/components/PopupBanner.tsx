'use client'
import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

const tipoColors: Record<string, { bg: string; border: string; badge: string; color: string }> = {
  info:        { bg: 'rgba(30,80,180,0.15)',  border: 'rgba(30,80,180,0.35)',  badge: '#7EA8E5', color: '#7EA8E5' },
  alerta:      { bg: 'rgba(200,16,46,0.12)',  border: 'rgba(200,16,46,0.35)',  badge: '#ff7a85', color: '#ff7a85' },
  invitacion:  { bg: 'rgba(0,122,51,0.12)',   border: 'rgba(0,122,51,0.35)',   badge: '#4CAF7D', color: '#4CAF7D' },
  comunicado:  { bg: 'rgba(242,169,0,0.12)',  border: 'rgba(242,169,0,0.35)', badge: '#F2A900', color: '#F2A900' },
}

const tipoLabels: Record<string, string> = {
  info: 'Información', alerta: 'Alerta', invitacion: 'Invitación', comunicado: 'Comunicado'
}

export default function PopupBanner() {
  const [popup, setPopup] = useState<any>(null)
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    loadPopup()
  }, [])

  const loadPopup = async () => {
    try {
      const res = await fetch(`${API}/api/popups/`)
      if (!res.ok) return
      const data = await res.json()

      if (data.mostrar_una_vez) {
        const key = `febora_popup_${data.id}`
        if (localStorage.getItem(key)) return
        localStorage.setItem(key, '1')
      }

      setPopup(data)
      setTimeout(() => setVisible(true), 800)
    } catch {}
  }

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => { setVisible(false); setClosing(false) }, 300)
  }

  if (!popup || !visible) return null

  const colors = tipoColors[popup.tipo] || tipoColors.info

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      padding: '1rem',
      opacity: closing ? 0 : 1,
      transition: 'opacity 0.3s ease',
    }} onClick={e => e.target === e.currentTarget && handleClose()}>

      <div style={{
        background: '#141414', border: `1px solid ${colors.border}`,
        borderRadius: '12px', maxWidth: '520px', width: '100%',
        overflow: 'hidden', position: 'relative',
        transform: closing ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.3s ease',
        boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px ${colors.border}`
      }}>

        {/* FRANJA SUPERIOR TRICOLOR */}
        <div style={{ display: 'flex', height: '3px' }}>
          <div style={{ background: '#C8102E', flex: 1 }}/>
          <div style={{ background: '#F2A900', flex: 1 }}/>
          <div style={{ background: '#007A33', flex: 1 }}/>
        </div>

        {/* IMAGEN */}
        {popup.imagen_url && (
          <div style={{ width: '100%', aspectRatio: '16/7', overflow: 'hidden' }}>
            <img src={popup.imagen_url} alt={popup.titulo}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>
        )}

        {/* CONTENIDO */}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
            <div>
              <span style={{
                display: 'inline-block', fontSize: '0.62rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', padding: '0.25rem 0.65rem', borderRadius: '2px',
                background: colors.bg, color: colors.badge,
                border: `1px solid ${colors.border}`, marginBottom: '0.75rem'
              }}>
                {tipoLabels[popup.tipo] || popup.tipo}
              </span>
              <h2 style={{
                fontFamily: "'Bebas Neue', serif", fontSize: '1.8rem',
                letterSpacing: '0.04em', lineHeight: 1.05, color: '#F0EEE8'
              }}>{popup.titulo}</h2>
            </div>
            <button onClick={handleClose} style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: '#555', width: '32px', height: '32px', borderRadius: '6px',
              cursor: 'pointer', fontSize: '1rem', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s'
            }}>✕</button>
          </div>

          {popup.contenido && (
            <p style={{
              fontSize: '0.9rem', fontWeight: 300, color: 'rgba(250,250,248,0.65)',
              lineHeight: 1.75, marginBottom: popup.btn_label ? '1.5rem' : '0'
            }}>{popup.contenido}</p>
          )}

          {popup.btn_label && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <a href={popup.btn_url || '#'} onClick={handleClose}
                style={{
                  background: '#C8102E', color: '#fff', padding: '0.7rem 1.5rem',
                  fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase', borderRadius: '4px', textDecoration: 'none',
                  transition: 'background 0.2s'
                }}>
                {popup.btn_label}
              </a>
              <button onClick={handleClose} style={{
                background: 'transparent', border: 'none', color: '#555',
                fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                Cerrar
              </button>
            </div>
          )}
        </div>

        {/* LOGO FEBORA */}
        <div style={{
          position: 'absolute', bottom: '1.5rem', right: '1.5rem',
          fontFamily: "'Bebas Neue', serif", fontSize: '0.9rem',
          letterSpacing: '0.12em', color: 'rgba(255,255,255,0.1)'
        }}>FE<span style={{ color: 'rgba(242,169,0,0.2)' }}>BORA</span></div>

      </div>
    </div>
  )
}
