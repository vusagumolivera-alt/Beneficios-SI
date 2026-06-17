import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bcyrcyugumzfqbdlosyt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeXJjeXVndW16ZnFiZGxvc3l0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDQ4MiwiZXhwIjoyMDk2NzU2NDgyfQ.dU1PKNJar2MU6cQ3T_BCJ_yFC1EbowjeLTPXtrdMhMA'
)

const BASE = 'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos'

const NUEVOS = [
  {
    nombre: 'Yogurtmania',
    descripcion_descuento: '20% OFF en toda la tienda',
    descuento: 20,
    rubro: 'Helados',
    direccion: 'San Isidro',
    localidad: 'San Isidro',
    dias_validos: '',
    medios_pago: '',
    condiciones: '',
    imagen_url: '',
    instagram_url: '',
    website_url: '',
    publicado: true,
    nuevo: true,
  },
  {
    nombre: 'Hocicos Pet Boutique',
    descripcion_descuento: '10% OFF en productos veterinarios y afines',
    descuento: 10,
    rubro: 'Veterinaria',
    direccion: 'San Isidro',
    localidad: 'San Isidro',
    dias_validos: '',
    medios_pago: '',
    condiciones: '',
    imagen_url: '',
    instagram_url: '',
    website_url: '',
    publicado: true,
    nuevo: true,
  },
  {
    nombre: 'Esquina Garibaldi',
    descripcion_descuento: '15% OFF en aves y productos de granja',
    descuento: 15,
    rubro: 'Aves y productos de granja',
    direccion: 'San Isidro',
    localidad: 'San Isidro',
    dias_validos: '',
    medios_pago: '',
    condiciones: '',
    imagen_url: `${BASE}/ellipse-23.png`,
    instagram_url: '',
    website_url: '',
    publicado: true,
    nuevo: true,
  },
  {
    nombre: 'La Plaza Hogar',
    descripcion_descuento: '5% OFF en audio, TV, iluminación y alarmas',
    descuento: 5,
    rubro: 'Audio, TV e iluminación',
    direccion: 'Boulogne',
    localidad: 'Boulogne',
    dias_validos: '',
    medios_pago: '',
    condiciones: '',
    imagen_url: '',
    instagram_url: '',
    website_url: '',
    publicado: true,
    nuevo: false,
  },
  {
    nombre: 'Grido Acassuso',
    descripcion_descuento: '50% OFF en helados',
    descuento: 50,
    rubro: 'Helados',
    direccion: 'Acassuso',
    localidad: 'Acassuso',
    dias_validos: '',
    medios_pago: '',
    condiciones: '',
    imagen_url: '',
    instagram_url: '',
    website_url: '',
    publicado: true,
    nuevo: true,
  },
]

// Dietéticas Tomy ya existe en la BD (una sucursal). Agregamos la segunda.
const DIETETICAS_SEGUNDA = {
  nombre: 'Dietéticas Tomy',
  descripcion_descuento: '10% OFF en almacén y dietética',
  descuento: 10,
  rubro: 'Almacén y dietética',
  direccion: 'Boulogne',
  localidad: 'Boulogne',
  dias_validos: '',
  medios_pago: '',
  condiciones: '',
  imagen_url: `${BASE}/ellipse-18.png`,
  instagram_url: '',
  website_url: '',
  publicado: true,
  nuevo: false,
}

async function main() {
  // Verificar cuál sucursal de Dietéticas Tomy ya existe
  const { data: existing } = await supabase
    .from('comercios')
    .select('localidad')
    .ilike('nombre', '%tomy%')

  console.log('Dietéticas Tomy existentes:', existing?.map(r => r.localidad))

  const existingLocalidades = existing?.map(r => r.localidad) || []
  if (!existingLocalidades.includes('Boulogne')) {
    NUEVOS.push(DIETETICAS_SEGUNDA)
    console.log('→ Agrego sucursal Boulogne de Dietéticas Tomy')
  } else {
    console.log('→ Sucursal Boulogne ya existe, skip')
  }

  const { data, error } = await supabase.from('comercios').insert(NUEVOS).select('nombre')

  if (error) {
    console.error('❌ Error:', error.message)
  } else {
    console.log('\n✅ Comercios agregados:')
    data?.forEach(c => console.log(' -', c.nombre))
  }
}

main()
