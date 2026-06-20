import { api } from '@/lib/api'

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/api/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  // Cloudinary devuelve URL completa — no agregar prefijo
  return data.url
}
