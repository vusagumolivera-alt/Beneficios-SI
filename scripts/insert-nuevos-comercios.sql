-- =====================================================
-- INSERT: 5 nuevos comercios (junio 2026)
-- Farmacia Fabris pendiente de datos
-- =====================================================

-- 1. LOF (Óptica)
INSERT INTO comercios (
  nombre, descripcion_descuento, descuento, rubro,
  direccion, localidad, dias_validos, medios_pago,
  condiciones, imagen_url, instagram_url,
  publicado, nuevo
) VALUES (
  'LOF',
  '20% OFF en todos los productos',
  20,
  'Óptica, ortopedia y fotografía',
  'Chacabuco 321',
  'San Isidro',
  'Lunes a sábado',
  'Efectivo, débito, crédito, Mercado Pago, transferencia y MODO',
  '20% en todos los productos. No acumulable con otras promociones y/o descuentos.',
  'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-lcf-optica.png',
  'https://www.instagram.com/opticalof',
  true, true
);

-- 2. Panaderías Delier
INSERT INTO comercios (
  nombre, descripcion_descuento, descuento, rubro,
  direccion, localidad, dias_validos, medios_pago,
  condiciones, imagen_url,
  publicado, nuevo
) VALUES (
  'Panaderías Delier',
  '15% OFF en todos los productos',
  15,
  'Panadería y almacén',
  'Hipólito Yrigoyen 102',
  'Martínez',
  'Lunes a miércoles',
  'Efectivo, débito, Mercado Pago, MODO y transferencia',
  'Válido para todos los productos.',
  'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-panaderias-delier.png',
  true, true
);

-- 3. FotoMartínez
INSERT INTO comercios (
  nombre, descripcion_descuento, descuento, rubro,
  direccion, localidad, dias_validos, medios_pago,
  condiciones, imagen_url,
  publicado, nuevo
) VALUES (
  'FotoMartínez',
  '20% OFF en productos seleccionados',
  20,
  'Óptica, ortopedia y fotografía',
  'Albarellos 1968',
  'Martínez',
  'Viernes',
  'Efectivo',
  'Descuento aplicable por la compra de 30 fotos o más, abonando en efectivo.',
  'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-foto-martinez.jpg',
  true, true
);

-- 4. iAP Boulogne
INSERT INTO comercios (
  nombre, descripcion_descuento, descuento, rubro,
  direccion, localidad, dias_validos, medios_pago,
  condiciones, imagen_url, instagram_url,
  publicado, nuevo
) VALUES (
  'iAP Boulogne',
  '40% OFF en cursos de peluquería y estética',
  40,
  'Peluquería y salón de belleza',
  'Av. Avelino Rolón 1854',
  'Boulogne',
  'Martes a viernes',
  'Efectivo, débito, crédito, Mercado Pago y transferencia',
  'Beca especial en la inscripción a cursos y talleres: Peluquería, Barbería, Colorista Internacional, Alisados, Cortes, Recuperación Capilar, Maquillaje, Manicuría, Cejas, Pestañas, Microblading, Extensiones y Tatuaje. Cupos limitados.',
  'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-iap-boulogne.png',
  'https://www.instagram.com/iap_boulogne3110',
  true, true
);

-- 5. Mar de Flores
INSERT INTO comercios (
  nombre, descripcion_descuento, descuento, rubro,
  direccion, localidad, dias_validos, medios_pago,
  condiciones, imagen_url,
  publicado, nuevo
) VALUES (
  'Mar de Flores',
  '10% OFF en ramos medianos y grandes',
  10,
  'Florería',
  'Av. Sucre 587',
  'Boulogne',
  'Martes',
  'Efectivo y transferencia',
  'Descuento en ramos medianos y grandes con flores de estación, abonando en efectivo o transferencia.',
  'https://bcyrcyugumzfqbdlosyt.supabase.co/storage/v1/object/public/logos/logo-mar-de-flores.jpg',
  true, true
);
