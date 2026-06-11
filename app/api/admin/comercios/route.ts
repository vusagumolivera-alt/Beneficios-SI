import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return url && !url.includes('TU_PROYECTO') && url.startsWith('https://')
}

export async function GET() {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  if (!isSupabaseConfigured()) {
    return NextResponse.json([])
  }

  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { data, error } = await client
    .from('comercios')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
