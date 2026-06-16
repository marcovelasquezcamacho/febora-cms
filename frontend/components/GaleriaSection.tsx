'use client'
import { useState, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://febora-cms-production.up.railway.app'

const categoriaLabels: Record<string, string> = {
  todos: 'Todos',
  torneo: 'Torneos',
  seleccion: 'Selección',
  premiacion: 'Premiación',
  entrenamiento: 'Entrenamiento',
  general: 'General',
}

export default function GaleriaSection() {
  const [fotos, setFotos] = useState<any[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [lightbox, setLightbox] = useState<any>(null)
  const [mostrarTodas, setMostrarTodas] = useState(false)

  useEffect(() => {
    loadCategorias()
    loadFotos('todos')
  }, [])

  const loadCategorias = async () => {
    try {
      const res = await fetch(`${API}/api/galeria/categorias`)
      const data = await res.json()
      setCategorias(data)
    } catch {}
  }

  const loadFotos = async (cat: string) => {
    try {
      const url = cat === 'todos'
        ? `${API}/api/galeria/`
        : `${API}/api/galeria/?categoria=${cat}`
      const res = await fetch(url)
      const data = await res.json()
      setFotos(data)
      setMostrarTodas(false)
    } catch {}
  }

  const handleCategoria = (cat: string) => {
    setCategoriaActiva(cat)
    loadFotos(cat)
  }

  const fotosMostradas = mostrarTodas ? fotos : fotos.slice(0, 7)

  if (fotos.length === 0) return null

  const fotoPrincipal = fotos.find(f => f.destacada) || fotos[0]
  const fotosSecundarias = fotosMostradas.filter(f => f.id !== fotoPrincipal?.id)

  return (
    <section id="galeria" style={{ background: '#141414', padding: '7rem 4rem' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ display: 'block', width: '20px', height: '1px', background: '#F2A900' }}/>
        Galería
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.04em', lineHeight: 1.05 }}>
          MOMENTOS <span style={{ color: '#C8102E' }}>DESTACADOS</span>
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['todos', ...categorias].map(cat => (
            <button key={cat} onClick={() => handleCategoria(cat)}
              style={{ background: categoriaActiva === cat ? '#C8102E' : 'transparent', color: categoriaActiva === cat ? '#fff' : '#888', border: `1px solid ${categoriaActiva === cat ? '#C8102E' : 'rgba(255,255,255,0.12)'}`, padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.15s' }}>
              {categoriaLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'repeat(2, 200px)', gap: '4px' }}>

        {/* FOTO PRINCIPAL */}
        {fotoPrincipal && (
          <div onClick={() => setLightbox(fotoPrincipal)}
            style={{ gridRow: '1/3', background: '#1A1A1A', borderRadius: '6px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
            <img src={fotoPrincipal.imagen_url} alt={fotoPrincipal.titulo}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => (e.target as HTMLElement).style.transform = 'scale(1.03)'}
              onMouseLeave={e => (e.target as HTMLElement).style.transform = 'scale(1)'}/>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {fotoPrincipal.categoria && (
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '0.4rem' }}>
                  {categoriaLabels[fotoPrincipal.categoria] || fotoPrincipal.categoria}
                </span>
              )}
              {fotoPrincipal.titulo && (
                <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: '1.4rem', letterSpacing: '0.04em', color: '#F0EEE8', lineHeight: 1.1 }}>
                  {fotoPrincipal.titulo}
                </div>
              )}
            </div>
            {fotoPrincipal.destacada && (
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(242,169,0,0.2)', border: '1px solid rgba(242,169,0,0.4)', color: '#F2A900', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '2px' }}>
                Destacada
              </div>
            )}
          </div>
        )}

        {/* FOTOS SECUNDARIAS */}
        {fotosSecundarias.slice(0, 3).map((foto, i) => (
          <div key={foto.id} onClick={() => setLightbox(foto)}
            style={{ background: '#1A1A1A', borderRadius: '6px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
            <img src={foto.imagen_url} alt={foto.titulo}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
              onMouseLeave={e => (e.target as HTMLElement).style.transform = 'scale(1)'}/>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)', padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {foto.titulo && (
                <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#F0EEE8', lineHeight: 1.3 }}>{foto.titulo}</div>
              )}
            </div>
            {/* OVERLAY "más fotos" en última celda si hay más */}
            {i === 3 && !mostrarTodas && fotos.length > 7 && (
              <div onClick={e => { e.stopPropagation(); setMostrarTodas(true) }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: '2rem', color: '#F0EEE8' }}>+{fotos.length - 7}</div>
                <div style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>más fotos</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FOTOS EXTRA */}
      {mostrarTodas && fotosSecundarias.length > 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '4px' }}>
          {fotosSecundarias.slice(3).map(foto => (
            <div key={foto.id} onClick={() => setLightbox(foto)}
              style={{ aspectRatio: '4/3', background: '#1A1A1A', borderRadius: '6px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
              <img src={foto.imagen_url} alt={foto.titulo}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
                onMouseLeave={e => (e.target as HTMLElement).style.transform = 'scale(1)'}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)', padding: '0.75rem', display: 'flex', alignItems: 'flex-end' }}>
                {foto.titulo && <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#F0EEE8' }}>{foto.titulo}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BTN VER TODAS */}
      {!mostrarTodas && fotos.length > 7 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => setMostrarTodas(true)}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#888', padding: '0.7rem 2rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#F2A900'; (e.target as HTMLElement).style.color = '#F2A900' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.target as HTMLElement).style.color = '#888' }}>
            Ver galería completa →
          </button>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <button onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>

          <div onClick={e => e.stopPropagation()}
            style={{ maxWidth: '900px', width: '100%' }}>
            <img src={lightbox.imagen_url} alt={lightbox.titulo}
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }}/>
            {(lightbox.titulo || lightbox.descripcion) && (
              <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: '#141414', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)' }}>
                {lightbox.categoria && (
                  <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F2A900', display: 'block', marginBottom: '0.4rem' }}>
                    {categoriaLabels[lightbox.categoria] || lightbox.categoria}
                  </span>
                )}
                {lightbox.titulo && (
                  <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: '1.5rem', letterSpacing: '0.04em', color: '#F0EEE8', marginBottom: lightbox.descripcion ? '0.5rem' : 0 }}>
                    {lightbox.titulo}
                  </div>
                )}
                {lightbox.descripcion && (
                  <p style={{ fontSize: '0.88rem', color: 'rgba(250,250,248,0.55)', lineHeight: 1.7, fontWeight: 300 }}>
                    {lightbox.descripcion}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
