-- Cargar McDonald's como beneficio (Supabase → SQL Editor → pegar y ejecutar)
-- El nombre tiene que ser exactamente "McDonald's": el banner y los cupones se activan por nombre.
-- Antes: subir el logo a Storage (bucket logos) como logo-mcdonalds.png, o usar el SVG incluido en la app.

INSERT INTO comercios (nombre, descripcion_descuento, descuento, rubro, direccion, localidad, dias_validos, medios_pago, condiciones, imagen_url, instagram_url, website_url, publicado, nuevo)
VALUES (
  'McDonald''s',
  'Hasta 30% OFF, 2x1 y café gratis con cupones QR',
  30,
  'Gastronomía',
  'Todas las sucursales del país',
  'San Isidro',
  'Todos los días',
  'Efectivo, tarjetas, Mercado Pago y MODO',
  'Válido presentando el cupón generado en la App de McDonald''s. Imágenes de carácter ilustrativo. No acumulable con otras promociones. Vigencia hasta el 31/12/2026.',
  '/cupones/mcdonalds/logo.svg',
  'https://www.instagram.com/mcdonalds_ar/',
  'https://www.mcdonalds.com.ar/',
  true,
  true
);
