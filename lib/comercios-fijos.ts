import type { Comercio } from '@/lib/supabase'
import { slugify } from '@/lib/cupones'

/**
 * Comercios que viven en el código y no en la base (ej. McDonald's, con cupones QR).
 * Si en la base existe un comercio con el mismo nombre normalizado, gana el de la base
 * (así se puede editar o despublicar desde el admin sin tocar código).
 */
export const COMERCIOS_FIJOS: Comercio[] = [
  {
    id: 'mcdonalds',
    nombre: "McDonald's",
    descripcion_descuento: 'Hasta 30% OFF, 2x1 y café gratis con cupones en la App',
    descuento: 30,
    rubro: 'Gastronomía',
    direccion: 'Todas las sucursales del país',
    localidad: 'San Isidro',
    dias_validos: 'Todos los días',
    medios_pago: 'Efectivo, tarjetas, Mercado Pago y MODO',
    condiciones: "Válido presentando el cupón generado en la App de McDonald's. Imágenes de carácter ilustrativo. No acumulable con otras promociones. Vigencia hasta el 31/12/2026.",
    imagen_url: '/cupones/mcdonalds/logo.svg',
    instagram_url: 'https://www.instagram.com/mcdonalds_ar/',
    website_url: 'https://www.mcdonalds.com.ar/',
    publicado: true,
    nuevo: true,
    created_at: '2026-09-15T00:00:00.000Z',
  },
]

export function mergeFijos(deBase: Comercio[]): Comercio[] {
  const nombres = new Set(deBase.map(c => slugify(c.nombre)))
  const extra = COMERCIOS_FIJOS.filter(f => f.publicado && !nombres.has(slugify(f.nombre)))
  return [...extra, ...deBase]
}

export function buscarFijo(id: string): Comercio | null {
  return COMERCIOS_FIJOS.find(c => c.id === id && c.publicado) || null
}
