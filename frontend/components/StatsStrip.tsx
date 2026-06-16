export default function StatsStrip({ stats }: { stats: any[] }) {
  const defaults = [
    { valor: 'TOP 5', etiqueta: 'Ranking Mundial' },
    { valor: '+20', etiqueta: 'Atletas nacionales' },
    { valor: '+15', etiqueta: 'Torneos internacionales' },
    { valor: '9', etiqueta: 'Departamentos afiliados' },
  ]
  const data = stats.length > 0 ? stats : defaults

  return (
    <div style={{
      background: '#1A1A1A', borderTop: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`,
    }}>
      {data.map((s: any, i: number) => (
        <div key={i} style={{
          textAlign: 'center', padding: '2.5rem 1.5rem',
          borderRight: i < data.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', serif", fontSize: '3.5rem', lineHeight: 1,
            background: 'linear-gradient(135deg, #F2A900, #C8102E)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>{s.valor}</div>
          <div style={{
            fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#888', marginTop: '0.5rem'
          }}>{s.etiqueta}</div>
        </div>
      ))}
    </div>
  )
}
