import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function getJugador(id: string) {
  try {
    const res = await fetch(`${API}/api/jugadores/${id}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const jugador = await getJugador(id)
  if (!jugador) return { title: 'Jugador no encontrado' }

  const title = `${jugador.nombre} ${jugador.apellido} — ${jugador.ranking_etiqueta || 'Jugador'} FEBORA`
  const description = jugador.descripcion_corta || `Conoce a ${jugador.nombre} ${jugador.apellido}, representante de Bolivia en el raquetbol internacional.`
  const image = jugador.foto_url || `${SITE_URL}/og-default.jpg`

  return {
    title,
    description,
    alternates: { canonical: `/jugadores/${id}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/jugadores/${id}`,
      images: [{ url: image, width: 800, height: 1000, alt: `${jugador.nombre} ${jugador.apellido}` }],
      type: 'profile',
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default async function JugadorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const jugador = await getJugador(id)
  if (!jugador) notFound()

  return (
    <main style={{ background: '#0D0D0D', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#FAFAF8' }}>
      <Navbar />
      <section style={{ padding: '10rem 4rem 7rem', maxWidth: '900px', margin: '0 auto' }}>
        <a href="/#jugadores" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#555', textDecoration: 'none', marginBottom: '3rem'
        }}>← Volver a jugadores</a>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start' }}>
          <div style={{
            aspectRatio: '3/4', background: 'linear-gradient(145deg, #1a0508, #3d0f17)',
            borderRadius: '8px', overflow: 'hidden', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {jugador.foto_url
              ? <img src={jugador.foto_url} alt={jugador.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              : <span style={{ fontFamily: "'Bebas Neue', serif", fontSize: '6rem', opacity: 0.15, color: '#fff' }}>{jugador.iniciales}</span>
            }
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(13,13,13,0.9), transparent)',
              padding: '2rem 1.5rem'
            }}>
              <span style={{
                fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                background: 'rgba(242,169,0,0.2)', color: '#F2A900',
                border: '1px solid rgba(242,169,0,0.35)', padding: '0.3rem 0.7rem', borderRadius: '2px'
              }}>{jugador.tag_texto}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A900', marginBottom: '0.75rem' }}>
              🏆 {jugador.ranking_etiqueta}
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', serif", fontSize: '4rem', letterSpacing: '0.04em', lineHeight: 0.95, marginBottom: '0.5rem' }}>
              {jugador.nombre.toUpperCase()}<br/>
              <span style={{ color: '#C8102E' }}>{jugador.apellido.toUpperCase()}</span>
            </h1>
            <div style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', marginBottom: '2rem' }}>
              Raquetbol — {jugador.nacionalidad}
            </div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '2rem' }}/>
            {jugador.descripcion_corta && (
              <p style={{ fontSize: '1rem', fontWeight: 300, color: 'rgba(250,250,248,0.65)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                {jugador.descripcion_corta}
              </p>
            )}
            {jugador.biografia && (
              <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'rgba(250,250,248,0.45)', lineHeight: 1.85 }}>
                {jugador.biografia}
              </p>
            )}
            {jugador.logros?.length > 0 && (
              <div style={{ marginTop: '2.5rem' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>
                  Logros personales
                </div>
                {jugador.logros.map((l: any) => (
                  <div key={l.id} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#F2A900', fontWeight: 600, fontSize: '0.82rem', minWidth: '50px' }}>{l.anio}</span>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(250,250,248,0.6)' }}>{l.titulo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
