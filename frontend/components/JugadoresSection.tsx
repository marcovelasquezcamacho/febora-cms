'use client'
import { useState, useEffect, useCallback } from 'react'
import { useResponsive } from '@/lib/useResponsive'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://febora-cms-production.up.railway.app'

const CATEGORIAS = [
  { value: 'infantil',  label: 'Infantil',  color: '#4CAF7D' },
  { value: 'juvenil',   label: 'Juvenil',   color: '#7EA8E5' },
  { value: 'senior',    label: 'Senior',    color: '#C8102E' },
  { value: 'master',    label: 'Master',    color: '#CD7F32' },
]

const BG_COLORS = ['#1a0508', '#0d1a08', '#1a140a', '#080d1a', '#0a0d1a', '#1a0a14']

async function fetchConRetry(url: string, intentos = 3): Promise<any> {
  for (let i = 0; i < intentos; i++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timeout)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (i === intentos - 1) throw err
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
}

export default function JugadoresSection({ jugadores }: { jugadores: any[] }) {
  const { isMobile, isTablet } = useResponsive()
  const pad = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2.5rem' : '7rem 4rem'

  const [categoriaActiva, setCategoriaActiva] = useState('')
  const [jugadoresCat, setJugadoresCat] = useState<any[]>([])
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<string[]>([])
  const [loadingCat, setLoadingCat] = useState(false)
  const [error, setError] = useState('')

  const internacionales = jugadores.filter(j => j.categoria === 'internacional' || !j.categoria)
  const cols = isMobile ? 2 : Math.min(internacionales.length, 4)

  useEffect(() => {
    fetchConRetry(`${API}/api/jugadores/categorias`)
      .then((cats: string[]) => {
        const sinInt = cats.filter(c => c !== 'internacional')
        setCategoriasDisponibles(sinInt)
        if (sinInt.length > 0) {
          setCategoriaActiva(sinInt[0])
          loadJugadoresCat(sinInt[0])
        }
      })
      .catch(() => {})
  }, [])

  const loadJugadoresCat = useCallback(async (cat: string) => {
    setLoadingCat(true)
    setError('')
    try {
      const data = await fetchConRetry(`${API}/api/jugadores/?categoria=${cat}`)
      setJugadoresCat(data)
    } catch {
      setError('No se pudieron cargar los jugadores. Intenta nuevamente.')
      setJugadoresCat([])
    } finally {
      setLoadingCat(false)
    }
  }, [])

  const handleTab = (cat: string) => {
    setCategoriaActiva(cat)
    loadJugadoresCat(cat)
  }

  const catConfig = (val: string) => CATEGORIAS.find(c => c.value === val) || { label: val, color: '#888' }

  return (
    <section id="jugadores" style={{ background: '#0D0D0D', padding: pad }}>

      <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>
        Selección nacional
      </div>
      <h2 style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.04em', marginBottom: isMobile ? '2rem' : '3rem', lineHeight: 1.1 }}>
        LOS QUE <span style={{ color: '#F2A900' }}>REPRESENTAN</span> A BOLIVIA
      </h2>

      {/* INTERNACIONALES */}
      {internacionales.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '2px', marginBottom: categoriasDisponibles.length > 0 ? '4rem' : '0' }}>
          {internacionales.map((j: any, i: number) => (
            <a key={j.id} href={`/jugadores/${j.id}`} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', cursor: 'pointer', textDecoration: 'none', background: `linear-gradient(145deg, ${BG_COLORS[i % BG_COLORS.length]}, ${BG_COLORS[(i+1) % BG_COLORS.length]})` }}>
              {j.foto_url && <img src={j.foto_url} alt={j.nombre} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.3) 50%, transparent 100%)', padding: isMobile ? '1rem' : '2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                {!j.foto_url && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '3rem' : '5rem', opacity: 0.1, color: '#fff' }}>{j.iniciales}</div>}
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#F2A900', marginBottom: '0.3rem' }}>🏆 {j.ranking_etiqueta}</div>
                <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '1.1rem' : '1.6rem', letterSpacing: '0.06em', lineHeight: 1.1, color: '#FAFAF8', marginBottom: '0.3rem' }}>
                  {j.nombre.toUpperCase()}<br/>{j.apellido.toUpperCase()}
                </div>
                {!isMobile && <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>Raquetbol — {j.nacionalidad}</div>}
                <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.6rem', borderRadius: '2px', fontWeight: 600, background: 'rgba(200,16,46,0.2)', color: '#C8102E', border: '1px solid rgba(200,16,46,0.4)', width: 'fit-content' }}>{j.tag_texto}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* CATEGORÍAS */}
      {categoriasDisponibles.length > 0 && (
        <>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '3rem' }}/>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>
            Categorías nacionales
          </div>
          <h3 style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '1.8rem' : '2.5rem', letterSpacing: '0.04em', marginBottom: '2rem', color: '#FAFAF8' }}>
            JUGADORES POR <span style={{ color: '#C8102E' }}>CATEGORÍA</span>
          </h3>

          {/* TABS */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {categoriasDisponibles.map(cat => {
              const ci = catConfig(cat)
              const activo = categoriaActiva === cat
              return (
                <button key={cat} onClick={() => handleTab(cat)}
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', border: `1px solid ${activo ? ci.color : 'rgba(255,255,255,0.12)'}`, background: activo ? `${ci.color}20` : 'transparent', color: activo ? ci.color : '#888', transition: 'all 0.2s' }}>
                  {ci.label}
                </button>
              )
            })}
          </div>

          {/* ESTADO */}
          {loadingCat ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#555', fontSize: '0.82rem' }}>
              <div style={{ marginBottom: '0.5rem', fontSize: '1.5rem', opacity: 0.3 }}>⏳</div>
              Cargando jugadores...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px' }}>
              <div style={{ color: '#555', fontSize: '0.82rem', marginBottom: '1rem' }}>{error}</div>
              <button onClick={() => loadJugadoresCat(categoriaActiva)}
                style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                Reintentar
              </button>
            </div>
          ) : jugadoresCat.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#555', fontSize: '0.82rem' }}>
              No hay jugadores registrados en esta categoría
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)', gap: '8px' }}>
              {jugadoresCat.map((j: any, i: number) => {
                const ci = catConfig(j.categoria)
                return (
                  <a key={j.id} href={`/jugadores/${j.id}`}
                    style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '1.25rem 1rem', textAlign: 'center', textDecoration: 'none', transition: 'border-color 0.2s, background 0.2s', display: 'block' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ci.color; (e.currentTarget as HTMLElement).style.background = '#1A1A1A' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background = '#141414' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 0.75rem', overflow: 'hidden', background: `linear-gradient(145deg, ${BG_COLORS[i % BG_COLORS.length]}, ${BG_COLORS[(i+1) % BG_COLORS.length]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${ci.color}40` }}>
                      {j.foto_url
                        ? <img src={j.foto_url} alt={j.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        : <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: '1rem', color: 'rgba(255,255,255,0.3)' }}>{j.iniciales}</span>
                      }
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 500, color: '#F0EEE8', marginBottom: '0.25rem', lineHeight: 1.3 }}>
                      {j.nombre}<br/>{j.apellido}
                    </div>
                    {j.ranking_etiqueta && (
                      <div style={{ fontSize: '0.65rem', color: ci.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.4rem' }}>
                        {j.ranking_etiqueta}
                      </div>
                    )}
                  </a>
                )
              })}
            </div>
          )}
        </>
      )}
    </section>
  )
}
