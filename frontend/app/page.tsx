import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import StatsStrip from '@/components/StatsStrip'
import JugadoresSection from '@/components/JugadoresSection'
import NosotrosSection from '@/components/NosotrosSection'
import LogrosSection from '@/components/LogrosSection'
import GaleriaSection from '@/components/GaleriaSection'
import NoticiasSection from '@/components/NoticiasSection'
import SponsorsSection from '@/components/SponsorsSection'
import ContactoSection from '@/components/ContactoSection'
import Footer from '@/components/Footer'
import PopupBanner from '@/components/PopupBanner'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

async function getData() {
  try {
    const [hero, stats, jugadores, logros, noticias] = await Promise.all([
      fetch(`${API}/api/hero/`, { next: { revalidate: 60 } }).then(r => r.ok ? r.json() : null),
      fetch(`${API}/api/estadisticas/`, { next: { revalidate: 60 } }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/jugadores/`, { next: { revalidate: 60 } }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/logros/`, { next: { revalidate: 60 } }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/noticias/`, { next: { revalidate: 60 } }).then(r => r.ok ? r.json() : []),
    ])
    return { hero, stats, jugadores, logros, noticias }
  } catch {
    return { hero: null, stats: [], jugadores: [], logros: [], noticias: [] }
  }
}

export default async function Home() {
  const { hero, stats, jugadores, logros, noticias } = await getData()
  return (
    <main style={{ background: '#0D0D0D', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#FAFAF8' }}>
      <Navbar />
      <HeroSection hero={hero} />
      <StatsStrip stats={stats} />
      <JugadoresSection jugadores={jugadores} />
      <NosotrosSection />
      <LogrosSection logros={logros} />
      <GaleriaSection />
      <NoticiasSection noticias={noticias} />
      <SponsorsSection />
      <ContactoSection />
      <Footer />
      <PopupBanner />
    </main>
  )
}
