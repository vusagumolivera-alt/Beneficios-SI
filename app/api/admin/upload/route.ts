import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

const MAX_BYTES = 4 * 1024 * 1024
const TIPOS: Record<string, string> = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg',
}

function slug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Sube un logo al bucket público "logos" de Supabase Storage y devuelve su URL
export async function POST(req: NextRequest) {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !url.startsWith('https://')) return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 })

  const form = await req.formData()
  const file = form.get('file')
  const nombre = String(form.get('nombre') || 'logo')
  if (!(file instanceof File)) return NextResponse.json({ error: 'Falta el archivo' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'La imagen supera los 4 MB' }, { status: 400 })
  const ext = TIPOS[file.type]
  if (!ext) return NextResponse.json({ error: 'Formato no admitido (usar PNG, JPG, WEBP o SVG)' }, { status: 400 })

  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } })
  const path = `logo-${slug(nombre) || 'comercio'}-${Date.now().toString(36)}.${ext}`
  const bytes = Buffer.from(await file.arrayBuffer())
  const { error } = await client.storage.from('logos').upload(path, bytes, { contentType: file.type, upsert: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = client.storage.from('logos').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
