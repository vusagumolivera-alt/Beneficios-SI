-- INSERT: Farmacia Fabris
INSERT INTO comercios (
  nombre, descripcion_descuento, descuento, rubro,
  direccion, localidad, dias_validos, medios_pago,
  condiciones, imagen_url, instagram_url,
  publicado, nuevo
) VALUES (
  'Farmacia Fabris',
  '10% OFF en medicamentos y productos',
  10,
  'Farmacia',
  'Av. Centenario 448',
  'San Isidro',
  'Lunes y miércoles',
  'Efectivo',
  'Válido en medicamentos de venta bajo receta y venta libre para particulares. Abonando en efectivo.',
  'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-farmacia-fabris.png',
  'https://www.instagram.com/farmaciafabrisok',
  true, true
);

-- UPDATE logo La Cabina Cultural
-- (correr DESPUÉS de subir logo-la-cabina-cultural.png a Supabase Storage)
UPDATE comercios
SET imagen_url = 'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-la-cabina-cultural.png'
WHERE id = '695e1fd6-a7c8-4f88-bcd6-1ad197f7eac1';
