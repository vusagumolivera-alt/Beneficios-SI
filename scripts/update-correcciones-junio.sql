-- =====================================================
-- CORRECCIONES DIRECCIONES E INSTAGRAM (PDF junio 2026)
-- =====================================================

-- Kiosco Nahuel: instagram
UPDATE comercios SET instagram_url = 'https://www.instagram.com/kiosco_nahuel?igsh=MXRsZ3VrOHl3bjJrbQ=='
WHERE nombre ILIKE '%nahuel%';

-- Grupo Laminar: dirección
UPDATE comercios SET direccion = 'Av. Márquez 2942', localidad = 'San Isidro'
WHERE nombre ILIKE '%laminar%';

-- Margarita: dirección
UPDATE comercios SET direccion = '25 de Mayo 163', localidad = 'San Isidro'
WHERE id = '57dc47d6-345f-4ff0-9d56-6c20237a33a8';

-- Di Pietro: dirección
UPDATE comercios SET direccion = 'Córdoba 701', localidad = 'Martínez'
WHERE nombre ILIKE '%di pietro%';

-- Giro Didáctico: dirección
UPDATE comercios SET direccion = 'Garrido 325', localidad = 'San Isidro'
WHERE nombre ILIKE '%giro did%';

-- Comsale: dirección
UPDATE comercios SET direccion = 'Jose Ingenieros 3241', localidad = 'Beccar'
WHERE nombre ILIKE '%comsale%';

-- Lue Heladería: dirección
UPDATE comercios SET direccion = 'Azcuénaga 1356', localidad = 'Martínez'
WHERE nombre ILIKE '%lue%';

-- Lidherma: dirección
UPDATE comercios SET direccion = 'Arenales 2039', localidad = 'Martínez'
WHERE nombre ILIKE '%lidherma%';

-- M&A Beauty Spa: instagram + dirección
UPDATE comercios SET
  instagram_url = 'https://www.instagram.com/myabeautyspa_/',
  direccion     = 'Juan Segundo Fernandez 1267',
  localidad     = 'San Isidro'
WHERE nombre ILIKE '%beauty%spa%' OR nombre ILIKE '%m%a beauty%';

-- Hocicos Pet Boutique: instagram
UPDATE comercios SET instagram_url = 'https://www.instagram.com/hocicospetboutique/'
WHERE id = '28375695-a707-451f-b470-19ad6b0e6955';

-- Dietéticas Tomy: dirección + instagram
UPDATE comercios SET
  direccion     = 'Av. Centenario 340',
  localidad     = 'San Isidro',
  instagram_url = 'https://www.instagram.com/dietify.ar?igsh=MWQxeTl4aTBmOWw5YQ=='
WHERE nombre ILIKE '%tomy%';

-- Esquina Garibaldi: dirección + instagram
UPDATE comercios SET
  direccion     = 'Francia 200',
  localidad     = 'San Isidro',
  instagram_url = 'https://www.instagram.com/esquinagaribaldigranja?igsh=anp3b3V0a2hycDRz'
WHERE nombre ILIKE '%garibaldi%';

-- Yogurtmania: instagram
UPDATE comercios SET instagram_url = 'https://instagram.com/yogurtmaniaarg'
WHERE id = '27cc0f3d-0d4b-44b9-9c46-63fc4a281257';

-- Estudio Danzas RC: instagram
UPDATE comercios SET instagram_url = 'https://www.instagram.com/estudiodanzas.rc/'
WHERE nombre ILIKE '%danzas%rc%' OR nombre ILIKE '%estudio danzas%';

-- =====================================================
-- SWAP DE LOGOS: La Cabina Cultural ↔ Esquina Garibaldi
-- PASO 1: Copiar logo actual de Esquina Garibaldi → La Cabina Cultural
-- =====================================================
UPDATE comercios
SET imagen_url = (
  SELECT imagen_url FROM comercios WHERE nombre ILIKE '%garibaldi%' LIMIT 1
)
WHERE id = '695e1fd6-a7c8-4f88-bcd6-1ad197f7eac1'; -- La Cabina Cultural

-- =====================================================
-- PASO 2: Nuevo logo para Esquina Garibaldi
-- ⚠️  Correr DESPUÉS de subir logo-esquina-garibaldi.jpg a Supabase Storage
-- =====================================================
UPDATE comercios
SET imagen_url = 'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-esquina-garibaldi.jpg'
WHERE nombre ILIKE '%garibaldi%';
