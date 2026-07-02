'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useResponsive } from '@/lib/useResponsive'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://febora-cms-production.up.railway.app'

const CATEGORIAS = [
  { value: 'infantil',  label: 'Infantil',  color: '#4CAF7D' },
  { value: 'juvenil',   label: 'Juvenil',   color: '#7EA8E5' },
  { value: 'senior',    label: 'Senior',    color: '#C8102E' },
  { value: 'master',    label: 'Master',    color: '#CD7F32' },
]

const BG_COLORS = ['#1a0508', '#0d1a08', '#1a140a', '#080d1a', '#0a0d1a', '#1a0a14']

function Carrusel({ items, renderItem, itemWidth, gap = 12 }: {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  itemWidth: number
  gap?: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startPos, setStartPos] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalWidth = items.length * (itemWidth + gap) - gap
  const containerWidth = containerRef.current?.offsetWidth || 800
  const maxPos = Math.max(0, totalWidth - containerWidth)
  const needsCarrusel = totalWidth > containerWidth

  const clamp = (v: number) => Math.max(0, Math.min(v, maxPos))

  const scrollBy = (dir: number) => {
    setPos(prev => clamp(prev + dir * (itemWidth + gap) * 2))
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (!needsCarrusel) return
    setIsDragging(true)
    setStartX(e.clientX)
    setStartPos(pos)
  }

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    const delta = startX - e.clientX
    setPos(clamp(startPos + delta))
  }, [isDragging, startX, startPos, maxPos])

  const onMouseUp = useCallback(() => setIsDragging(false), [])

  const onTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setStartPos(pos)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const delta = startX - e.touches[0].clientX
    setPos(clamp(startPos + delta))
  }

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  useEffect(() => { setPos(0) }, [items])

  return (
    <div style={{ position: 'relative' }}>
      <div ref={containerRef} style={{ overflow: 'hidden', cursor: needsCarrusel ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}>
        <div ref={trackRef}
          style={{ display: 'flex', gap: `${gap}px`, transform: `translateX(-${pos}px)`, transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)', willChange: 'transform' }}>
          {items.map((item, i) => (
            <div key={item.id || i} style={{ width: `${itemWidth}px`, flexShrink: 0 }}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>

      {/* BOTONES */}
      {needsCarrusel && (
        <>
          <button onClick={() => scrollBy(-1)} disabled={pos === 0}
            style={{ position: 'absolute', left: '-18px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: pos === 0 ? 'rgba(255,255,255,0.05)' : '#C8102E', border: `1px solid ${pos === 0 ? 'rgba(255,255,255,0.1)' : '#C8102E'}`, color: pos === 0 ? '#444' : '#fff', cursor: pos === 0 ? 'not-allowed' : 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 2 }}>
            ‹
          </button>
          <button onClick={() => scrollBy(1)} disabled={pos >= maxPos}
            style={{ position: 'absolute', right: '-18px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: pos >= maxPos ? 'rgba(255,255,255,0.05)' : '#C8102E', border: `1px solid ${pos >= maxPos ? 'rgba(255,255,255,0.1)' : '#C8102E'}`, color: pos >= maxPos ? '#444' : '#fff', cursor: pos >= maxPos ? 'not-allowed' : 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 2 }}>
            ›
          </button>

          {/* INDICADOR */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '1.25rem' }}>
            {Array.from({ length: Math.ceil(items.length / 2) }).map((_, i) => {
              const step = maxPos / Math.max(1, Math.ceil(items.length / 2) - 1)
              const activo = Math.round(pos / step) === i
              return (
                <button key={i} onClick={() => setPos(clamp(i * step))}
                  style={{ width: activo ? '20px' : '6px', height: '6px', borderRadius: '3px', background: activo ? '#C8102E' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}/>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default function JugadoresSection({ jugadores }: { jugadores: any[] }) {
  const { isMobile, isTablet } = useResponsive()
  const pad = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2.5rem' : '7rem 4rem'

  const [categoriaActiva, setCategoriaActiva] = useState('')
  const [todosCat, setTodosCat] = useState<Record<string, any[]>>({})
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const internacionales = jugadores.filter(j => j.categoria === 'internacional' || !j.categoria)

  const cardWidthInt = isMobile ? 160 : isTablet ? 200 : 240
  const cardWidthCat = isMobile ? 140 : isTablet ? 160 : 180

  useEffect(() => {
    fetch(`${API}/api/jugadores/`)
      .then(r => r.ok ? r.json() : [])
      .then((todos: any[]) => {
        const agrupados: Record<string, any[]> = {}
        todos.forEach(j => {
          const cat = j.categoria || 'internacional'
          if (cat === 'internacional') return
          if (!agrupados[cat]) agrupados[cat] = []
          agrupados[cat].push(j)
        })
        const orden = ['infantil', 'juvenil', 'senior', 'master']
        const catsConJugadores = orden.filter(c => agrupados[c]?.length > 0)
        setTodosCat(agrupados)
        setCategoriasDisponibles(catsConJugadores)
        if (catsConJugadores.length > 0) setCategoriaActiva(catsConJugadores[0])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const catConfig = (val: string) => CATEGORIAS.find(c => c.value === val) || { label: val, color: '#888' }
  const jugadoresCat = todosCat[categoriaActiva] || []

  const renderInternacional = (j: any, i: number) => (
    <a href={`/jugadores/${j.id}`} style={{ display: 'block', position: 'relative', aspectRatio: '3/4', overflow: 'hidden', textDecoration: 'none', borderRadius: '6px', background: `linear-gradient(145deg, ${BG_COLORS[i % BG_COLORS.length]}, ${BG_COLORS[(i+1) % BG_COLORS.length]})`, userSelect: 'none' }}>
      {j.foto_url && <img src={j.foto_url} alt={j.nombre} draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}/>}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.3) 50%, transparent 100%)', padding: isMobile ? '1rem' : '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {!j.foto_url && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Bebas Neue', serif", fontSize: '4rem', opacity: 0.1, color: '#fff' }}>{j.iniciales}</div>}
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: '#F2A900', marginBottom: '0.3rem' }}>🏆 {j.ranking_etiqueta}</div>
        <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '1rem' : '1.3rem', letterSpacing: '0.06em', lineHeight: 1.1, color: '#FAFAF8', marginBottom: '0.3rem' }}>
          {j.nombre.toUpperCase()}<br/>{j.apellido.toUpperCase()}
        </div>
        <span style={{ display: 'inline-block', marginTop: '0.4rem', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: '2px', fontWeight: 600, background: 'rgba(200,16,46,0.2)', color: '#C8102E', border: '1px solid rgba(200,16,46,0.4)', width: 'fit-content' }}>{j.tag_texto}</span>
      </div>
    </a>
  )

  const renderCatCard = (j: any, i: number) => {
    const ci = catConfig(j.categoria)
    return (
      <a href={`/jugadores/${j.id}`}
        style={{ display: 'block', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '1.25rem 0.75rem', textAlign: 'center', textDecoration: 'none', userSelect: 'none' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', margin: '0 auto 0.75rem', overflow: 'hidden', background: `linear-gradient(145deg, ${BG_COLORS[i % BG_COLORS.length]}, ${BG_COLORS[(i+1) % BG_COLORS.length]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${ci.color}40` }}>
          {j.foto_url
            ? <img src={j.foto_url} alt={j.nombre} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}/>
            : <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)' }}>{j.iniciales}</span>
          }
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#F0EEE8', lineHeight: 1.3, marginBottom: '0.25rem' }}>
          {j.nombre}<br/>{j.apellido}
        </div>
        {j.ranking_etiqueta && (
          <div style={{ fontSize: '0.6rem', color: ci.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.4rem' }}>
            {j.ranking_etiqueta}
          </div>
        )}
      </a>
    )
  }

  return (
    <section id="jugadores" style={{ background: '#0D0D0D', padding: pad }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>
        Selección nacional
      </div>
      <h2 style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.04em', marginBottom: isMobile ? '2rem' : '3rem', lineHeight: 1.1 }}>
        LOS QUE <span style={{ color: '#F2A900' }}>REPRESENTAN</span> A BOLIVIA
      </h2>

      {/* CARRUSEL INTERNACIONALES */}
      {internacionales.length > 0 && (
        <div style={{ marginBottom: categoriasDisponibles.length > 0 ? '4rem' : '0', padding: '0 24px' }}>
          <Carrusel
            items={internacionales}
            renderItem={renderInternacional}
            itemWidth={cardWidthInt}
            gap={4}
          />
        </div>
      )}

      {/* CATEGORÍAS */}
      {(loading || categoriasDisponibles.length > 0) && (
        <>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '3rem' }}/>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>
            Categorías nacionales
          </div>
          <h3 style={{ fontFamily: "'Bebas Neue', serif", fontSize: isMobile ? '1.8rem' : '2.5rem', letterSpacing: '0.04em', marginBottom: '2rem', color: '#FAFAF8' }}>
            JUGADORES POR <span style={{ color: '#C8102E' }}>CATEGORÍA</span>
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#555', fontSize: '0.82rem' }}>Cargando categorías...</div>
          ) : (
            <>
              {/* TABS */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {categoriasDisponibles.map(cat => {
                  const ci = catConfig(cat)
                  const activo = categoriaActiva === cat
                  return (
                    <button key={cat} onClick={() => setCategoriaActiva(cat)}
                      style={{ padding: '0.5rem 1.25rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', border: `1px solid ${activo ? ci.color : 'rgba(255,255,255,0.12)'}`, background: activo ? `${ci.color}20` : 'transparent', color: activo ? ci.color : '#888', transition: 'all 0.2s' }}>
                      {ci.label} ({todosCat[cat]?.length || 0})
                    </button>
                  )
                })}
              </div>

              {/* CARRUSEL CATEGORÍAS */}
              {jugadoresCat.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#555', fontSize: '0.82rem' }}>
                  No hay jugadores en esta categoría
                </div>
              ) : (
                <div style={{ padding: '0 24px' }}>
                  <Carrusel
                    items={jugadoresCat}
                    renderItem={renderCatCard}
                    itemWidth={cardWidthCat}
                    gap={8}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}
