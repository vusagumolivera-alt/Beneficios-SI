import { NextRequest, NextResponse } from 'next/server'
import { signAdminToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const expected = process.env.ADMIN_PASSWORD

  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const token = await signAdminToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return res
}
