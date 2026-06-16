import { MetadataRoute } from 'next'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  ]

  try {
    const jugadoresRes = await fetch(`${API}/api/jugadores/`)
    if (jugadoresRes.ok) {
      const jugadores = await jugadoresRes.json()
      jugadores.forEach((j: any) => {
        entries.push({
          url: `${SITE_URL}/jugadores/${j.id}`,
          lastModified: j.updated_at ? new Date(j.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      })
    }
  } catch {}

  try {
    const noticiasRes = await fetch(`${API}/api/noticias/?limite=50`)
    if (noticiasRes.ok) {
      const noticias = await noticiasRes.json()
      noticias.forEach((n: any) => {
        entries.push({
          url: `${SITE_URL}/noticias/${n.slug}`,
          lastModified: n.updated_at ? new Date(n.updated_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      })
    }
  } catch {}

  return entries
}
