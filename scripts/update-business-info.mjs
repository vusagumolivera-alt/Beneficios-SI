import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bcyrcyugumzfqbdlosyt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeXJjeXVndW16ZnFiZGxvc3l0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDQ4MiwiZXhwIjoyMDk2NzU2NDgyfQ.dU1PKNJar2MU6cQ3T_BCJ_yFC1EbowjeLTPXtrdMhMA'
)

// Data extracted from TESI screenshots
const UPDATES = [
  {
    keyword: 'lidherma',
    data: {
      instagram_url: 'https://www.instagram.com/lidhermamartiez/',
      dias_validos: 'Lunes a Sábados',
      medios_pago: 'Efectivo',
      condiciones: '10% de descuento en todos los servicios de peluquería y estética',
    },
  },
  {
    keyword: 'margarita',
    data: {
      instagram_url: 'https://www.instagram.com/margaritasanisidro/',
      direccion: '25 de Mayo, San Isidro',
      dias_validos: 'Lunes a Viernes',
      medios_pago: 'Efectivo, Transferencia',
      condiciones: '10% de descuento en todos los productos',
    },
  },
  {
    keyword: 'danzas',
    data: {
      instagram_url: 'https://www.instagram.com/estudiodasas/',
      dias_validos: 'Lunes a Viernes',
      medios_pago: 'Efectivo',
      condiciones: '30% de descuento en la cuota mensual de danzas o gimnasia, 2 veces por semana',
    },
  },
  {
    keyword: 'kiosco nahuel',
    data: {
      instagram_url: 'https://www.instagram.com/kiosco_nahuel/',
      direccion: 'Hipólito Irigoyen, Martínez',
      dias_validos: 'Lunes, Miércoles y Viernes',
      medios_pago: 'Efectivo',
      condiciones: 'Descuento del 10% abonando en efectivo. No incluye cigarrillos, tabacos ni yogures',
    },
  },
  {
    keyword: 'm&a',
    data: {
      instagram_url: 'https://www.instagram.com/mya.espa_/',
      direccion: 'Juan Segundo Fernández 1267, San Isidro',
      dias_validos: 'Miércoles',
      medios_pago: 'Efectivo',
      condiciones: '10% de descuento en manicura con esmaltado semipermanente los días miércoles, abonando en efectivo',
    },
  },
  {
    keyword: 'delta lux',
    data: {
      dias_validos: 'Lunes a Viernes',
      medios_pago: 'Efectivo, Mercado Pago, MODO, Transferencia',
      condiciones: '20% de descuento en anteojos y lentes fotográficas',
    },
  },
  {
    keyword: 'hocicos',
    data: {
      instagram_url: 'https://www.instagram.com/hocicosmartinez/',
      dias_validos: 'Todos los días',
      medios_pago: 'Efectivo, Débito, Crédito, Transferencia, Mercado Pago, MODO',
      condiciones: '10% de descuento en toda la tienda para empleados del Municipio de San Isidro',
    },
  },
  {
    keyword: 'pepina',
    data: {
      instagram_url: 'https://www.instagram.com/tiendapepina4/',
      rubro: 'Juguetería',
      dias_validos: 'Martes, Jueves y Sábados',
      condiciones: 'Descuento del 10% en todos los productos de la tienda',
    },
  },
  {
    keyword: 'camino',
    data: {
      instagram_url: 'https://www.instagram.com/ropadelcamino/',
      dias_validos: 'Todos los días',
      medios_pago: 'Efectivo',
      condiciones: 'Descuento del 20% en cualquier prenda abonando en efectivo',
    },
  },
  {
    keyword: 'garibaldi',
    data: {
      rubro: 'Frutería',
      dias_validos: 'Lunes y Martes',
      condiciones: 'Descuento en frutas y verduras seleccionadas',
    },
  },
  {
    keyword: 'comsale',
    data: {
      website_url: 'https://www.comsale.com.ar/',
      direccion: 'José Ingenieros, Beccar',
      dias_validos: 'Lunes a Viernes',
      medios_pago: 'Transferencia',
      condiciones: '20% de descuento en el total de la compra. Mejora las comunicaciones de tu empresa',
    },
  },
  {
    keyword: 'chuna',
    data: {
      instagram_url: 'https://www.instagram.com/chunasanisidro/',
      dias_validos: 'Lunes a Sábados',
      medios_pago: 'Efectivo, Transferencia',
      condiciones: '20% en todo el local para empleados del Municipio de San Isidro abonando en efectivo o transferencia',
    },
  },
  {
    keyword: 'di pietro',
    data: {
      instagram_url: 'https://www.instagram.com/dipietroblas/',
      direccion: 'Córdoba, Martínez',
      dias_validos: 'Viernes y Sábados',
      medios_pago: 'Mercado Pago, Transferencia, Crédito',
      condiciones: '15% de descuento en todos los productos de la nueva colección',
    },
  },
  {
    keyword: 'yogurtmania',
    data: {
      instagram_url: 'https://www.instagram.com/yogurtmania/',
      dias_validos: 'Lunes a Sábados',
      medios_pago: 'Efectivo, Débito, Mercado Pago',
      condiciones: '20% de descuento en cualquier tamaño',
    },
  },
  {
    keyword: 'laminar',
    data: {
      direccion: 'Avenida Márquez, San Isidro',
      dias_validos: 'Lunes a Viernes',
      medios_pago: 'Efectivo, Tarjeta',
      condiciones: '10% de descuento en todos los productos. No incluye servicios de mano de obra',
    },
  },
  {
    keyword: 'grido',
    data: {
      dias_validos: 'Todos los días',
      medios_pago: 'Efectivo, Débito, Crédito, Mercado Pago, Transferencia',
      condiciones: '50% de descuento en helados',
    },
  },
]

// Dietéticas Tomy: 2 sucursales, actualizar por separado
async function updateDieteticasTomy(comercios) {
  const branches = comercios.filter(c => c.nombre.toLowerCase().includes('tomy'))

  for (const c of branches) {
    let updateData = {
      medios_pago: 'Efectivo, Transferencia',
      condiciones: '10% de descuento en almacén y dietética en el momento de la compra',
    }

    if (c.localidad === 'San Isidro') {
      updateData.direccion = 'Avenida Centenario, San Isidro'
      updateData.dias_validos = 'Jueves y Sábados'
    } else {
      updateData.dias_validos = 'Jueves y Sábados'
    }

    const { error } = await supabase.from('comercios').update(updateData).eq('id', c.id)
    if (error) console.error(`❌ Dietéticas Tomy (${c.localidad}): ${error.message}`)
    else console.log(`✅ Dietéticas Tomy (${c.localidad}) → actualizada`)
  }
}

async function main() {
  const { data: comercios, error } = await supabase
    .from('comercios')
    .select('id, nombre, localidad')

  if (error) { console.error(error); return }
  console.log(`${comercios.length} comercios en la BD\n`)

  for (const { keyword, data: updateData } of UPDATES) {
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
        .update(updateData)
        .eq('id', c.id)

      if (upErr) console.error(`❌ ${c.nombre}: ${upErr.message}`)
      else console.log(`✅ ${c.nombre} (${c.localidad}) → actualizado`)
    }
  }

  console.log('\n--- Dietéticas Tomy ---')
  await updateDieteticasTomy(comercios)

  console.log('\n✅ Listo!')
}

main()
