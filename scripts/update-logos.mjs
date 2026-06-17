import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bcyrcyugumzfqbdlosyt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeXJjeXVndW16ZnFiZGxvc3l0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDQ4MiwiZXhwIjoyMDk2NzU2NDgyfQ.dU1PKNJar2MU6cQ3T_BCJ_yFC1EbowjeLTPXtrdMhMA'
)

const BASE = 'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos'

// Mapeo logo → nombre del comercio (búsqueda parcial, case-insensitive)
const LOGO_MAP = [
  { logo: 'ellipse-34.png', nombre: 'M&A' },
  { logo: 'ellipse-33.png', nombre: 'La Esquina' },
  { logo: 'group-170.png',  nombre: 'Lidherma' },
  { logo: 'ellipse-29.png', nombre: 'Kiosco Nahuel' },
  { logo: 'ellipse-30.png', nombre: 'Danzas' },
  { logo: 'group-252.png',  nombre: 'Delta Lux' },
  { logo: 'ellipse-25.png', nombre: 'Comsale' },
  { logo: 'group-253.png',  nombre: 'Margarita' },
  { logo: 'ellipse-26.png', nombre: 'Laminar' },
  { logo: 'ellipse-27.png', nombre: 'Di Pietro' },
  { logo: 'ellipse-28.png', nombre: 'Ropa del Camino' },
  { logo: 'ellipse-22.png', nombre: 'Chuna' },
  { logo: 'ellipse-21.png', nombre: 'Tienda Pepina' },
  { logo: 'ellipse-20.png', nombre: 'Rallys' },
  { logo: 'ellipse-19.png', nombre: 'Como Siempre' },
  { logo: 'ellipse-18.png', nombre: 'Dietéticas Tomy' },
  { logo: 'ellipse-17.png', nombre: 'Candelaria' },
  { logo: 'ellipse-16.png', nombre: 'Lue' },
  { logo: 'ellipse-15.png', nombre: 'Dulce Hora' },
  { logo: 'ellipse-14.png', nombre: 'Motoshow' },
  { logo: 'ellipse-13.png', nombre: 'Giro Didáctico' },
  { logo: 'ellipse-12.png', nombre: 'Franccesca' },
  { logo: 'ellipse-24.png', nombre: 'Farola' },
  { logo: 'ellipse-32.png', nombre: 'Camping' },
]

async function main() {
  // Traer todos los comercios
  const { data: comercios, error } = await supabase.from('comercios').select('id, nombre')
  if (error) { console.error(error); return }

  console.log(`${comercios.length} comercios en la BD\n`)

  for (const { logo, nombre: keyword } of LOGO_MAP) {
    const found = comercios.filter(c =>
      c.nombre.toLowerCase().includes(keyword.toLowerCase())
    )

    if (found.length === 0) {
      console.log(`⚠️  No encontrado: "${keyword}"`)
      continue
    }

    for (const c of found) {
      const { error: upErr } = await supabase
        .from('comercios')
        .update({ imagen_url: `${BASE}/${logo}` })
        .eq('id', c.id)

      if (upErr) {
        console.error(`❌ ${c.nombre}: ${upErr.message}`)
      } else {
        console.log(`✅ ${c.nombre}  →  ${logo}`)
      }
    }
  }
  console.log('\nListo!')
}

main()
