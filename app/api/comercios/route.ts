import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

import DEMO_DATA from '@/lib/demo-data.json'

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return url && !url.includes('TU_PROYECTO') && url.startsWith('https://')
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(DEMO_DATA)
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data, error } = await client
      .from('comercios')
      .select('*')
      .eq('publicado', true)
      .order('nuevo', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Error de conexión' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 })
  }

  const body = await req.json()
  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { data, error } = await client
    .from('comercios')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
