import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import DEMO_DATA from '@/lib/demo-data.json'
import { buscarFijo } from '@/lib/comercios-fijos'

type Ctx = { params: Promise<{ id: string }> }

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return url && !url.includes('TU_PROYECTO') && url.startsWith('https://')
}

async function getAdminClient() {
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Público: ficha de un comercio publicado
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params

  const fijo = buscarFijo(id)
  if (fijo) return NextResponse.json(fijo)

  if (!isSupabaseConfigured()) {
    const found = (DEMO_DATA as { id: string }[]).find(c => c.id === id)
    return found ? NextResponse.json(found) : NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { data, error } = await client
    .from('comercios')
    .select('*')
    .eq('id', id)
    .eq('publicado', true)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const client = await getAdminClient()
  const { data, error } = await client
    .from('comercios')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const client = await getAdminClient()
  const { error } = await client
    .from('comercios')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
