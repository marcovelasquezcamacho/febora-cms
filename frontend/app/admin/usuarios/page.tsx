'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { api } from '@/lib/api'

const emptyForm = { nombre: '', email: '', password: '', rol: 'editor' }

const permisos = {
  superadmin: [
    { icon: '✅', texto: 'Acceso total a todos los módulos' },
    { icon: '✅', texto: 'Gestión de usuarios y roles' },
    { icon: '✅', texto: 'Configuración del sitio' },
    { icon: '✅', texto: 'Eliminar contenido' },
  ],
  editor: [
    { icon: '✅', texto: 'Gestionar jugadores y noticias' },
    { icon: '✅', texto: 'Gestionar galería, logros y popups' },
    { icon: '✅', texto: 'Gestionar sponsors' },
    { icon: '✅', texto: 'Editar hero y secciones' },
    { icon: '❌', texto: 'No puede gestionar usuarios' },
    { icon: '❌', texto: 'No puede eliminar usuarios ni cambiar roles' },
  ],
}

export default function UsuariosPage() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('febora_user')
    if (u) {
      const parsed = JSON.parse(u)
      setCurrentUser(parsed)
      if (parsed.rol !== 'superadmin') {
        setAccessDenied(true)
        return
      }
    }
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      const { data } = await api.get('/api/usuarios/')
      setUsuarios(data)
    } catch {}
  }

  const notify = (text: string) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (editId) {
        const payload: any = { nombre: form.nombre, rol: form.rol }
        if (form.password) payload.password = form.password
        await api.put(`/api/usuarios/${editId}`, payload)
        notify('Usuario actualizado correctamente')
      } else {
        await api.post('/api/usuarios/', form)
        notify('Usuario creado correctamente')
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      loadUsuarios()
    } catch (err: any) {
      notify(err?.response?.data?.detail || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (u: any) => {
    setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol })
    setEditId(u.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await api.delete(`/api/usuarios/${id}`)
      notify('Usuario eliminado')
      loadUsuarios()
    } catch (err: any) {
      notify(err?.response?.data?.detail || 'Error al eliminar')
    }
  }

  const toggleActivo = async (u: any) => {
    try {
      await api.put(`/api/usuarios/${u.id}`, { activo: !u.activo })
      notify(u.activo ? 'Usuario desactivado' : 'Usuario activado')
      loadUsuarios()
    } catch (err: any) {
      notify(err?.response?.data?.detail || 'Error')
    }
  }

  const inp = (style = {}) => ({
    width: '100%', background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.12)',
    color: '#F0EEE8', padding: '0.6rem 0.8rem', borderRadius: '6px',
    fontSize: '0.84rem', fontFamily: 'system-ui', boxSizing: 'border-box' as const,
    outline: 'none', ...style
  })

  const lbl = { display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#555', marginBottom: '0.35rem' }

  if (accessDenied) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🔒</div>
          <h1 style={{ fontFamily: 'serif', fontSize: '1.6rem', color: '#F0EEE8', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>ACCESO RESTRINGIDO</h1>
          <p style={{ fontSize: '0.85rem', color: '#555', maxWidth: '380px', lineHeight: 1.6 }}>
            Esta sección está disponible únicamente para usuarios con rol <strong style={{ color: '#F2A900' }}>superadmin</strong>.
            Tu rol actual es <strong style={{ color: '#888' }}>{currentUser?.rol}</strong>.
          </p>
          <button onClick={() => router.push('/admin/dashboard')}
            style={{ marginTop: '1.5rem', background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
            Volver al Dashboard
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', letterSpacing: '0.06em', color: '#F0EEE8', marginBottom: '0.2rem' }}>USUARIOS</h1>
          <p style={{ fontSize: '0.78rem', color: '#555' }}>Gestión de accesos al panel de administración</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true) }}
          style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
          + Nuevo usuario
        </button>
      </div>

      {/* TABLA */}
      <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Nombre', 'Email', 'Rol', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ color: '#F0EEE8', fontWeight: 500, fontSize: '0.84rem' }}>
                    {u.nombre}
                    {u.id === currentUser?.id && <span style={{ color: '#555', fontSize: '0.7rem', fontWeight: 400, marginLeft: '6px' }}>(tú)</span>}
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#888', fontSize: '0.82rem', fontFamily: 'monospace' }}>{u.email}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '2px', background: u.rol === 'superadmin' ? 'rgba(200,16,46,0.15)' : 'rgba(242,169,0,0.12)', color: u.rol === 'superadmin' ? '#ff7a85' : '#F2A900', border: `1px solid ${u.rol === 'superadmin' ? 'rgba(200,16,46,0.25)' : 'rgba(242,169,0,0.25)'}` }}>
                    {u.rol}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.55rem', borderRadius: '2px', background: u.activo ? 'rgba(0,122,51,0.15)' : 'rgba(255,255,255,0.05)', color: u.activo ? '#4CAF7D' : '#555', border: `1px solid ${u.activo ? 'rgba(0,122,51,0.25)' : 'rgba(255,255,255,0.08)'}` }}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => toggleActivo(u)} disabled={u.id === currentUser?.id}
                      style={{ width: '28px', height: '28px', background: 'transparent', border: `1px solid ${u.activo ? 'rgba(0,122,51,0.3)' : 'rgba(255,255,255,0.1)'}`, color: u.activo ? '#4CAF7D' : '#555', borderRadius: '4px', cursor: u.id === currentUser?.id ? 'not-allowed' : 'pointer', fontSize: '0.75rem', opacity: u.id === currentUser?.id ? 0.4 : 1 }}>
                      {u.activo ? '●' : '○'}
                    </button>
                    <button onClick={() => handleEdit(u)}
                      style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>✎</button>
                    <button onClick={() => handleDelete(u.id)} disabled={u.id === currentUser?.id}
                      style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(200,16,46,0.25)', color: '#C8102E', borderRadius: '4px', cursor: u.id === currentUser?.id ? 'not-allowed' : 'pointer', fontSize: '0.75rem', opacity: u.id === currentUser?.id ? 0.4 : 1 }}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GUÍA DE ROLES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {(['superadmin', 'editor'] as const).map(rol => (
          <div key={rol} style={{ background: '#141414', border: `1px solid ${rol === 'superadmin' ? 'rgba(200,16,46,0.2)' : 'rgba(242,169,0,0.2)'}`, borderRadius: '10px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.65rem', borderRadius: '2px', background: rol === 'superadmin' ? 'rgba(200,16,46,0.15)' : 'rgba(242,169,0,0.12)', color: rol === 'superadmin' ? '#ff7a85' : '#F2A900', border: `1px solid ${rol === 'superadmin' ? 'rgba(200,16,46,0.25)' : 'rgba(242,169,0,0.25)'}` }}>
                {rol}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#555' }}>
                {usuarios.filter(u => u.rol === rol).length} usuario(s)
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {permisos[rol].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', color: p.icon === '✅' ? 'rgba(250,250,248,0.6)' : '#444' }}>
                  <span style={{ fontSize: '0.75rem' }}>{p.icon}</span>
                  {p.texto}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#F0EEE8', letterSpacing: '0.06em' }}>
                {editId ? 'EDITAR USUARIO' : 'NUEVO USUARIO'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={lbl}>Nombre completo</label>
                <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={inp()}/>
              </div>
              <div>
                <label style={lbl}>Email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  disabled={!!editId} style={inp({ opacity: editId ? 0.5 : 1 })}/>
              </div>
              <div>
                <label style={lbl}>{editId ? 'Nueva contraseña (opcional)' : 'Contraseña'}</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder={editId ? 'Dejar vacío para no cambiar' : ''} style={inp()}/>
              </div>

              {/* SELECTOR DE ROL CON PERMISOS */}
              <div>
                <label style={lbl}>Rol</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  {(['editor', 'superadmin'] as const).map(rol => (
                    <button key={rol} onClick={() => setForm({ ...form, rol })}
                      style={{ padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', border: `1px solid ${form.rol === rol ? (rol === 'superadmin' ? 'rgba(200,16,46,0.5)' : 'rgba(242,169,0,0.5)') : 'rgba(255,255,255,0.1)'}`, background: form.rol === rol ? (rol === 'superadmin' ? 'rgba(200,16,46,0.12)' : 'rgba(242,169,0,0.1)') : 'transparent', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: form.rol === rol ? (rol === 'superadmin' ? '#ff7a85' : '#F2A900') : '#888', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {rol}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#555', lineHeight: 1.4 }}>
                        {rol === 'editor' ? 'Gestiona contenido, sin acceso a usuarios' : 'Acceso total al sistema'}
                      </div>
                    </button>
                  ))}
                </div>

                {/* PERMISOS DEL ROL SELECCIONADO */}
                <div style={{ background: '#1C1C1C', borderRadius: '6px', padding: '1rem', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '0.75rem' }}>
                    Permisos del rol seleccionado
                  </div>
                  {permisos[form.rol as 'superadmin' | 'editor'].map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: p.icon === '✅' ? 'rgba(250,250,248,0.6)' : '#444', marginBottom: '0.35rem' }}>
                      <span>{p.icon}</span>
                      {p.texto}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#888', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={loading} style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '0.6rem 1.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear usuario'}
              </button>
            </div>
          </div>
        </div>
      )}

      {msg && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: '#141414', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.85rem 1.25rem', fontSize: '0.82rem', color: '#F0EEE8', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          {msg}
        </div>
      )}
    </AdminLayout>
  )
}
