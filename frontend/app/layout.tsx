import type { Metadata } from 'next'
import './globals.css'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function getHeroData() {
  try {
    const res = await fetch(`${API}/api/hero/`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getHeroData()

  const title = 'FEBORA — Federación Nacional de Raquetbol de Bolivia'
  const description = hero?.subtitulo ||
    'Bolivia se posiciona entre los mejores del planeta en raquetbol. Top 5 mundial. Conoce a los campeones bolivianos.'
  const image = hero?.imagen_fondo_url || `${SITE_URL}/og-default.jpg`

  return {
    title: {
      default: title,
      template: '%s | FEBORA',
    },
    description,
    keywords: ['FEBORA', 'raquetbol Bolivia', 'racquetball', 'federación boliviana', 'Conrrado Moscoso', 'Kadin Carrasco', 'deporte Bolivia'],
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: '/' },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: 'FEBORA',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: 'es_BO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    icons: {
      icon: '/favicon.ico',
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
