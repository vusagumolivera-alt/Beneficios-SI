-- Ejecutar este script en el SQL Editor de tu proyecto Supabase
-- supabase.com → tu proyecto → SQL Editor → New query → pegar y ejecutar

CREATE TABLE IF NOT EXISTS comercios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion_descuento TEXT NOT NULL,
  descuento INT NOT NULL,
  rubro TEXT NOT NULL,
  direccion TEXT NOT NULL,
  localidad TEXT NOT NULL,
  dias_validos TEXT DEFAULT '',
  medios_pago TEXT DEFAULT '',
  condiciones TEXT DEFAULT '',
  publicado BOOLEAN DEFAULT true,
  nuevo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE comercios ENABLE ROW LEVEL SECURITY;

-- Empleados (anon) solo ven los publicados
CREATE POLICY "public_read_published" ON comercios
  FOR SELECT
  USING (publicado = true);

-- El service role key (usado en API routes del admin) bypasea RLS automáticamente

-- ======================================================
-- DATOS INICIALES (comercios del PDF de junio 2026)
-- ======================================================

INSERT INTO comercios (nombre, descripcion_descuento, descuento, rubro, direccion, localidad, dias_validos, medios_pago, condiciones, publicado, nuevo) VALUES

('M&A Beauty Spa', '10% OFF en manicura', 10, 'Peluquería y salón de belleza',
 'Juan Segundo Fernández 1267', 'San Isidro', 'Miércoles',
 'Efectivo y transferencia',
 'Beneficio válido en manicura con esmaltado semipermanente, abonando en efectivo o transferencia.',
 true, true),

('Tienda La Esquina', '15% OFF en toda la tienda', 15, 'Textiles y artículos personales',
 'Antonio Sáenz 2101', 'Boulogne', 'Lunes a sábado',
 'Efectivo, Mercado Pago, tarjeta de débito y transferencia',
 'Beneficio válido en toda la tienda.',
 true, true),

('Vida de Camping', '10% OFF en toda la tienda', 10, 'Deportes, camping, náutica y pesca',
 'Túpac Amaru 136', 'Boulogne', 'Lunes a sábado',
 'Efectivo y transferencia',
 'Beneficio válido en toda la tienda abonando en efectivo o transferencia.',
 true, true),

('Lidherma Martínez', '10% OFF en productos', 10, 'Peluquería y salón de belleza',
 'Arenales 2039', 'Martínez', 'Lunes a sábado',
 'Efectivo',
 'Beneficio válido en los productos de Lidherma Martínez abonando en efectivo.',
 true, true),

('Estudio Danzas RC', '30% OFF en cuota mensual', 30, 'Danzas y gimnasia',
 'Guayaquil 109', 'Boulogne', 'Lunes a viernes',
 'Efectivo',
 'Beneficio válido en la cuota mensual de clases de danzas o gimnasia con asistencia de 2 veces por semana.',
 true, true),

('Kiosco Nahuel', '10% OFF pagando en efectivo', 10, 'Kiosco',
 'Hipólito Yrigoyen 506', 'Martínez', 'Lunes, miércoles y viernes',
 'Efectivo',
 'Beneficio válido abonando en efectivo. No incluye cigarrillos, tabacos ni figuritas.',
 true, false),

('Margarita', '10% OFF todos los mediodías', 10, 'Comidas para llevar',
 '25 de Mayo 163', 'San Isidro', 'Lunes a viernes',
 'Efectivo y transferencia',
 'Beneficio válido durante el horario del mediodía (aplica en todos los productos).',
 true, false),

('ROPA del Camino', '20% OFF en prendas de vestir', 20, 'Indumentaria',
 'Arenales 2033', 'Martínez', 'Todos los días',
 'Efectivo',
 'Beneficio válido en cualquier prenda de vestir. El local cuenta con indumentaria masculina, femenina y unisex.',
 true, false),

('DI PIETRO BS AS', '15% OFF en la nueva colección', 15, 'Indumentaria',
 'Córdoba 701', 'Martínez', 'Viernes y sábado',
 'Efectivo, Mercado Pago, tarjetas de débito, tarjetas de crédito y transferencia',
 'Beneficio válido sobre productos de la nueva colección.',
 true, false),

('Grupo Laminar', '10% OFF en vidrios y espejos', 10, 'Vidrios, espejos y marcos',
 'Avenida Márquez 2942', 'San Isidro', 'Lunes a sábado',
 'Efectivo',
 'Beneficio válido en productos y servicios exclusivos para autos.',
 true, false),

('Óptica Delta Lux', '20% OFF en anteojos', 20, 'Óptica, ortopedia y fotografía',
 'Albarellos 2028', 'Martínez', 'Lunes a viernes',
 'Efectivo, Mercado Pago, MODO y transferencia',
 'Beneficio válido en anteojos y lentes oftálmicos. No aplica a contactología.',
 true, false),

('Comsale', '20% OFF de lunes a viernes', 20, 'Audio, TV, iluminación y electricidad',
 'José Ingenieros 3241', 'Beccar', 'Lunes a viernes',
 'Efectivo y transferencia',
 'Beneficio válido para todos los productos.',
 true, false),

('La Farola de Alvear', '15% OFF en toda la carta', 15, 'Gastronomía',
 'General Alvear 81', 'Martínez', 'Todos los días',
 'Efectivo, transferencia, Mercado Pago y tarjeta de débito',
 'No válido sobre menú ejecutivo. No acumulable con otras promociones.',
 true, false),

('La Cabina Cultural', '15% OFF en entradas', 15, 'Centro cultural',
 'Avenida Centenario 2073', 'Beccar', 'Sábados',
 'Efectivo',
 'Beneficio válido para productos seleccionados abonando en efectivo.',
 true, false),

('CHUNA', '20% OFF en todo el local', 20, 'Decoración, moda y regalos',
 'Rivadavia 267', 'San Isidro', 'Lunes a sábado',
 'Efectivo y transferencia',
 'Beneficio válido abonando en efectivo o transferencia.',
 true, false),

('Tienda Pepina', '10% OFF en productos seleccionados', 10, 'Juguetería',
 'Int. Tomkinson 2940', 'San Isidro', 'Miércoles y jueves',
 'Tarjeta de débito',
 'La tienda ofrece juegos y oráculos seleccionados dentro del beneficio.',
 true, false),

('Rallys', '10% OFF + hasta 3 cuotas sin interés', 10, 'Zapatería',
 'General Alvear 500', 'Martínez', 'Lunes a sábado',
 'Efectivo, Mercado Pago, tarjetas de débito, tarjetas de crédito, MODO y transferencia',
 'Incluye hasta 3 cuotas sin interés según modalidad vigente del local.',
 true, false),

('Como Siempre Resto', '10% OFF a la carta', 10, 'Gastronomía',
 'Ladislao Martínez 187', 'Martínez', 'Martes a domingos',
 'Efectivo',
 'Beneficio válido para consumo a la carta en almuerzos y cenas (productos seleccionados).',
 true, false),

('Dietéticas Tomy', '10% OFF en productos naturales', 10, 'Almacén / dietética',
 'Avelino Rolón 2101', 'Boulogne', 'Jueves y sábados',
 'Efectivo y transferencia',
 'Beneficio válido en productos de dietética y naturales.',
 true, false),

('La Candelaria Express', '30% OFF en la carta', 30, 'Gastronomía',
 'Av. Centenario 502', 'San Isidro', 'Martes a jueves',
 'Efectivo, Mercado Pago, tarjeta de débito y transferencia',
 'No incluye promociones vigentes del local.',
 true, false),

('Lue Heladería', '20% OFF en helados seleccionados', 20, 'Heladería',
 'Azcuénaga 1356', 'Martínez', '20% llevando 1/2 kg: martes, miércoles y viernes. 20% llevando 2 kg: todos los días.',
 'Efectivo y Mercado Pago',
 'No incluye promociones vigentes del local.',
 true, false),

('Dulce Hora Martínez', '10% OFF en todos los productos', 10, 'Panadería y confitería',
 'Albarellos 1961', 'Martínez', 'Lunes a miércoles y domingo',
 'Efectivo, Mercado Pago, tarjetas de débito, tarjetas de crédito, MODO y transferencia',
 'Beneficio válido en todos los productos.',
 true, false),

('Motoshow', '10% OFF en productos seleccionados', 10, 'Automotores y motos',
 'Av. del Libertador 13059', 'Martínez', 'Lunes a sábado',
 'Efectivo',
 'Incluye: motos 0km (Honda, Siam, Voge, Hero), servicio técnico oficial, indumentaria oficial Honda, repuestos originales, cascos y mochilas.',
 true, false),

('Giro Didáctico San Isidro', '20% OFF en todos los productos', 20, 'Juguetería',
 'Garrido 325', 'San Isidro', 'Lunes a jueves',
 'Efectivo',
 'No acumulable con otras promociones.',
 true, false),

('Franccesca Pastas Artesanales', '20% OFF en todos los productos', 20, 'Pastas frescas',
 'Chacabuco 395', 'San Isidro', 'Todos los días',
 'Efectivo, Mercado Pago, tarjetas de débito, tarjetas de crédito y MODO',
 'Promoción válida para todos los productos de la marca. No combinable con otras promociones.',
 true, false);
