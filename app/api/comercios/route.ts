import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

const DEMO_DATA = [
  { id: '1', nombre: 'M&A Beauty Spa', descripcion_descuento: '10% OFF en manicura', descuento: 10, rubro: 'Peluquería y salón de belleza', direccion: 'Juan Segundo Fernández 1267', localidad: 'San Isidro', dias_validos: 'Miércoles', medios_pago: 'Efectivo y transferencia', condiciones: 'Beneficio válido en manicura con esmaltado semipermanente.', publicado: true, nuevo: true, created_at: new Date().toISOString() },
  { id: '2', nombre: 'Tienda La Esquina', descripcion_descuento: '15% OFF en toda la tienda', descuento: 15, rubro: 'Textiles y artículos personales', direccion: 'Antonio Sáenz 2101', localidad: 'Boulogne', dias_validos: 'Lunes a sábado', medios_pago: 'Efectivo, Mercado Pago, tarjeta de débito y transferencia', condiciones: 'Beneficio válido en toda la tienda.', publicado: true, nuevo: true, created_at: new Date().toISOString() },
  { id: '3', nombre: 'Vida de Camping', descripcion_descuento: '10% OFF en toda la tienda', descuento: 10, rubro: 'Deportes, camping, náutica y pesca', direccion: 'Túpac Amaru 136', localidad: 'Boulogne', dias_validos: 'Lunes a sábado', medios_pago: 'Efectivo y transferencia', condiciones: 'Beneficio válido abonando en efectivo o transferencia.', publicado: true, nuevo: true, created_at: new Date().toISOString() },
  { id: '4', nombre: 'Estudio Danzas RC', descripcion_descuento: '30% OFF en cuota mensual', descuento: 30, rubro: 'Danzas y gimnasia', direccion: 'Guayaquil 109', localidad: 'Boulogne', dias_validos: 'Lunes a viernes', medios_pago: 'Efectivo', condiciones: 'Beneficio en cuota mensual con asistencia 2 veces por semana.', publicado: true, nuevo: true, created_at: new Date().toISOString() },
  { id: '5', nombre: 'La Candelaria Express', descripcion_descuento: '30% OFF en la carta', descuento: 30, rubro: 'Gastronomía', direccion: 'Av. Centenario 502', localidad: 'San Isidro', dias_validos: 'Martes a jueves', medios_pago: 'Efectivo, Mercado Pago y transferencia', condiciones: 'No incluye promociones vigentes del local.', publicado: true, nuevo: false, created_at: new Date().toISOString() },
  { id: '6', nombre: 'Óptica Delta Lux', descripcion_descuento: '20% OFF en anteojos', descuento: 20, rubro: 'Óptica, ortopedia y fotografía', direccion: 'Albarellos 2028', localidad: 'Martínez', dias_validos: 'Lunes a viernes', medios_pago: 'Efectivo, Mercado Pago, MODO y transferencia', condiciones: 'Válido en anteojos y lentes oftálmicos. No aplica a contactología.', publicado: true, nuevo: false, created_at: new Date().toISOString() },
  { id: '7', nombre: 'CHUNA', descripcion_descuento: '20% OFF en todo el local', descuento: 20, rubro: 'Decoración, moda y regalos', direccion: 'Rivadavia 267', localidad: 'San Isidro', dias_validos: 'Lunes a sábado', medios_pago: 'Efectivo y transferencia', condiciones: 'Beneficio válido abonando en efectivo o transferencia.', publicado: true, nuevo: false, created_at: new Date().toISOString() },
  { id: '8', nombre: 'Rallys', descripcion_descuento: '10% OFF + hasta 3 cuotas sin interés', descuento: 10, rubro: 'Zapatería', direccion: 'General Alvear 500', localidad: 'Martínez', dias_validos: 'Lunes a sábado', medios_pago: 'Efectivo, Mercado Pago, tarjetas, MODO y transferencia', condiciones: 'Incluye hasta 3 cuotas sin interés.', publicado: true, nuevo: false, created_at: new Date().toISOString() },
  { id: '9', nombre: 'Franccesca Pastas Artesanales', descripcion_descuento: '20% OFF en todos los productos', descuento: 20, rubro: 'Pastas frescas', direccion: 'Chacabuco 395', localidad: 'San Isidro', dias_validos: 'Todos los días', medios_pago: 'Efectivo, Mercado Pago, tarjetas y MODO', condiciones: 'No combinable con otras promociones.', publicado: true, nuevo: false, created_at: new Date().toISOString() },
  { id: '10', nombre: 'Como Siempre Resto', descripcion_descuento: '10% OFF a la carta', descuento: 10, rubro: 'Gastronomía', direccion: 'Ladislao Martínez 187', localidad: 'Martínez', dias_validos: 'Martes a domingos', medios_pago: 'Efectivo', condiciones: 'Válido para consumo a la carta en almuerzos y cenas.', publicado: true, nuevo: false, created_at: new Date().toISOString() },
  { id: '11', nombre: 'Motoshow', descripcion_descuento: '10% OFF en productos seleccionados', descuento: 10, rubro: 'Automotores y motos', direccion: 'Av. del Libertador 13059', localidad: 'Martínez', dias_validos: 'Lunes a sábado', medios_pago: 'Efectivo', condiciones: 'Incluye motos 0km, servicio técnico, indumentaria Honda, repuestos, cascos y mochilas.', publicado: true, nuevo: false, created_at: new Date().toISOString() },
  { id: '12', nombre: 'Giro Didáctico San Isidro', descripcion_descuento: '20% OFF en todos los productos', descuento: 20, rubro: 'Juguetería', direccion: 'Garrido 325', localidad: 'San Isidro', dias_validos: 'Lunes a jueves', medios_pago: 'Efectivo', condiciones: 'No acumulable con otras promociones.', publicado: true, nuevo: false, created_at: new Date().toISOString() },
]

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
