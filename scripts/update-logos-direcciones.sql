-- =====================================================
-- PASO 1: Actualizar direcciones de comercios existentes
-- =====================================================

UPDATE comercios SET direccion = 'Av. Santa Fe 48'           WHERE id = '28375695-a707-451f-b470-19ad6b0e6955'; -- Hocicos Pet Boutique
UPDATE comercios SET direccion = 'Perú 116'                  WHERE id = '77094667-b08e-4e8d-b63f-a0dd38ce71eb'; -- Grido Acassuso
UPDATE comercios SET direccion = '9 de Julio 454'            WHERE id = '27cc0f3d-0d4b-44b9-9c46-63fc4a281257'; -- Yogurtmania
UPDATE comercios SET direccion = 'Av. Avelino Rolón 2028'    WHERE id = '9a2ab7cb-ae24-433c-8d7f-656d8cfaeab8'; -- La Plaza Hogar

-- =====================================================
-- PASO 2: Actualizar logos de comercios existentes
-- (después de subir los archivos a Supabase Storage)
-- =====================================================

UPDATE comercios SET imagen_url = 'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-grido-acassuso.png'  WHERE id = '77094667-b08e-4e8d-b63f-a0dd38ce71eb';
UPDATE comercios SET imagen_url = 'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-yogurtmania.jpg'     WHERE id = '27cc0f3d-0d4b-44b9-9c46-63fc4a281257';
UPDATE comercios SET imagen_url = 'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-hocicos.png'          WHERE id = '28375695-a707-451f-b470-19ad6b0e6955';
UPDATE comercios SET imagen_url = 'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-la-plaza-hogar.png'   WHERE id = '9a2ab7cb-ae24-433c-8d7f-656d8cfaeab8';

-- =====================================================
-- PASO 3: Insertar Panaderías Delier (nuevo comercio)
-- ⚠️  Completar: descuento, descripcion_descuento, dias_validos, medios_pago
-- =====================================================

INSERT INTO comercios (
  nombre, rubro, direccion, localidad,
  descuento, descripcion_descuento, dias_validos, medios_pago,
  imagen_url, publicado, nuevo
) VALUES (
  'Panaderías Delier',
  'Panadería',
  'Hipólito Yrigoyen 102',
  'Martínez',
  10,                          -- ⚠️ confirmar % de descuento
  '10% de descuento',          -- ⚠️ confirmar descripción
  'Lunes a Sábado',            -- ⚠️ confirmar días
  'Efectivo',                  -- ⚠️ confirmar medios de pago
  'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-panaderias-delier.png',
  true,
  true
);
