import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://febora-cms-production.up.railway.app'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function getNoticia(slug: string) {
  try {
    const res = await fetch(`${API}/api/noticias/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

const catColors: Record<string, string> = {
  red: '#ff6b7a', green: '#4CAF7D', yellow: '#F2A900'
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const noticia = await getNoticia(slug)
  if (!noticia) return { title: 'Noticia no encontrada' }

  const title = noticia.titulo
  const description = noticia.resumen || noticia.contenido?.substring(0, 160) || 'Noticias de FEBORA — Federación Nacional de Raquetbol de Bolivia'
  const image = noticia.imagen_url || `${SITE_URL}/og-default.jpg`

  return {
    title,
    description,
    alternates: { canonical: `/noticias/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/noticias/${slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: 'article',
      publishedTime: noticia.fecha_publicacion,
      section: noticia.categoria,
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const noticia = await getNoticia(slug)
  if (!noticia) notFound()

  return (
    <main style={{ background: '#0D0D0D', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#FAFAF8' }}>
      <Navbar />
      <section style={{ padding: '10rem 4rem 7rem', maxWidth: '780px', margin: '0 auto' }}>
        <a href="/#noticias" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#555', textDecoration: 'none', marginBottom: '3rem'
        }}>← Volver a noticias</a>

        <span style={{
          display: 'inline-block', fontSize: '0.65rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', padding: '0.3rem 0.7rem', borderRadius: '2px',
          background: 'rgba(200,16,46,0.15)', color: catColors[noticia.categoria_color] || '#ff6b7a',
          marginBottom: '1.5rem'
        }}>{noticia.categoria}</span>

        <h1 style={{
          fontFamily: "'Bebas Neue', serif", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          letterSpacing: '0.04em', lineHeight: 1.05, marginBottom: '1rem'
        }}>{noticia.titulo}</h1>

        <div style={{ fontSize: '0.72rem', color: '#555', letterSpacing: '0.08em', marginBottom: '3rem' }}>
          FEBORA · {noticia.categoria} · {noticia.fecha_publicacion ? new Date(noticia.fecha_publicacion).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '3rem' }}/>

        {noticia.imagen_url && (
          <img src={noticia.imagen_url} alt={noticia.titulo} style={{
            width: '100%', borderRadius: '8px', marginBottom: '3rem',
            aspectRatio: '16/9', objectFit: 'cover'
          }}/>
        )}

        {noticia.resumen && (
          <p style={{
            fontSize: '1.15rem', fontWeight: 300, color: 'rgba(250,250,248,0.8)',
            lineHeight: 1.75, marginBottom: '2rem',
            borderLeft: '3px solid #C8102E', paddingLeft: '1.5rem'
          }}>{noticia.resumen}</p>
        )}

        {noticia.contenido && (
          <div style={{
            fontSize: '1rem', fontWeight: 300, color: 'rgba(250,250,248,0.6)',
            lineHeight: 1.9, whiteSpace: 'pre-wrap'
          }}>{noticia.contenido}</div>
        )}
      </section>
      <Footer />
    </main>
  )
}
