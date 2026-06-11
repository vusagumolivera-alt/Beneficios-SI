import { createClient } from '@supabase/supabase-js'

export type Comercio = {
  id: string
  nombre: string
  descripcion_descuento: string
  descuento: number
  rubro: string
  direccion: string
  localidad: string
  dias_validos: string
  medios_pago: string
  condiciones: string
  imagen_url: string
  instagram_url: string
  website_url: string
  publicado: boolean
  nuevo: boolean
  created_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = () =>
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
