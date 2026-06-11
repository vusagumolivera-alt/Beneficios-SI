import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

type Ctx = { params: Promise<{ id: string }> }

async function getAdminClient() {
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
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
